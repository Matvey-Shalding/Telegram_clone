'use server'

import { auth } from '@/auth'
import { PUSHER_KEYS } from '@/config/pusherKeys'
import { prisma } from '@/db/prisma'
import { pusherServer } from '@/lib/pusher'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
	try {
		// 1️⃣ Validate session
		const session = await auth.api.getSession({
			headers: await headers()
		})

		const userId = session?.user?.id

		if (!userId) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		// 2️⃣ Parse body safely
		const body = await req.json().catch(() => null)

		console.log('body', body)

		const content = body?.content
		const messageId = body?.messageId

		const conversationId = body?.conversationId

		if (!content || typeof content !== 'string') {
			return NextResponse.json({ error: 'Invalid reaction' }, { status: 400 })
		}

		if (!messageId || typeof messageId !== 'string') {
			return NextResponse.json({ error: 'Invalid messageId' }, { status: 400 })
		}

		if (!conversationId || typeof conversationId !== 'string') {
			return NextResponse.json({ error: 'Invalid conversationId ' }, { status: 400 })
		}

		// 3️⃣ Ensure message exists
		const message = await prisma.message.findUnique({
			where: { id: messageId },
			select: { id: true }
		})

		if (!message) {
			return NextResponse.json({ error: 'Message not found' }, { status: 404 })
		}

		// 4️⃣ Find existing reaction
		const existingReaction = await prisma.messageReaction.findFirst({
			where: {
				messageId,
				userId
			}
		})

		// 5️⃣ Reaction logic
		if (!existingReaction) {
			await prisma.messageReaction.create({
				data: {
					reaction: content,
					messageId,
					userId
				}
			})
		} else if (existingReaction.reaction === content) {
			await prisma.messageReaction.delete({
				where: { id: existingReaction.id }
			})
		} else {
			await prisma.messageReaction.update({
				where: { id: existingReaction.id },
				data: { reaction: content }
			})
		}

		// 6️⃣ Fetch updated message (used later for Pusher)
		const newMessage = await prisma.message.findUnique({
			where: { id: messageId },
			include: {
				reactions: true
			}
		})

		const conversation = await prisma.conversation.findFirst({
			where: {
				id: conversationId
			},
			include: {
				members: {
					include: {
						user: true
					}
				}
			}
		})

		if (!conversation) {
			return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
		}

		for (const member of conversation.members) {
			pusherServer.trigger(`user-${member.userId}`, PUSHER_KEYS.NEW_REACTION, {
				conversationId: conversationId,
				message: newMessage
			})
		}

		return NextResponse.json(
			{
				newMessage
			},
			{ status: 200 }
		)
	} catch (error) {
		console.error('POST /api/message-reaction error:', error)

		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

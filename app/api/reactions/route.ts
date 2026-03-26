'use server'

import { auth } from '@/auth'
import { PUSHER_KEYS } from '@/config/pusherKeys'
import { prisma } from '@/db/prisma'
import { pusherServer } from '@/lib/pusher/pusher'
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
			return NextResponse.json({ error: 'Invalid conversationId' }, { status: 400 })
		}

		// 3️⃣ Ensure message exists
		const message = await prisma.message.findUnique({
			where: { id: messageId },
			select: { id: true }
		})

		if (!message) {
			return NextResponse.json({ error: 'Message not found' }, { status: 404 })
		}

		// 4️⃣ Find existing reaction from this user
		const existingReaction = await prisma.messageReaction.findFirst({
			where: {
				messageId,
				userId
			}
		})

		let reaction

		// 5️⃣ Reaction toggle logic
		if (!existingReaction) {
			reaction = await prisma.messageReaction.create({
				data: {
					reaction: content,
					messageId,
					userId
				},
				include: {
					user: true
				}
			})
		} else if (existingReaction.reaction === content) {
			reaction = await prisma.messageReaction.delete({
				where: { id: existingReaction.id },
				include: {
					user: true
				}
			})
		} else {
			reaction = await prisma.messageReaction.update({
				where: { id: existingReaction.id },
				data: { reaction: content },
				include: {
					user: true
				}
			})
		}

		// 6️⃣ Fetch updated message for Pusher
		const newMessage = await prisma.message.findUnique({
			where: { id: messageId },
			include: {
				reactions: {
					include: {
						user: true
					}
				}
			}
		})

		console.log(newMessage, 'newMessage')

		const conversation = await prisma.conversation.findFirst({
			where: { id: conversationId },
			include: {
				members: true
			}
		})

		if (!conversation) {
			return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
		}

		// 7️⃣ Send realtime update
		for (const member of conversation.members) {
			await pusherServer.trigger(`user-${member.userId}`, PUSHER_KEYS.NEW_REACTION, {
				conversationId,
				message: newMessage
			})
		}

		// 8️⃣ Return reaction for optimistic update replacement
		return NextResponse.json(
			{
				reaction
			},
			{ status: 200 }
		)
	} catch (error) {
		console.error('POST /api/message-reaction error:', error)

		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

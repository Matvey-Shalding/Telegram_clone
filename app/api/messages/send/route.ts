import { auth } from '@/auth'
import { PUSHER_KEYS } from '@/config/pusherKeys'
import { prisma } from '@/db/prisma'
import { pusherServer } from '@/lib/pusher'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
	try {
		const session = await auth.api.getSession({ headers: await headers() })
		const userId = session?.user.id

		// User not found

		if (!userId) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const body = await req.json()
		const content = typeof body.content === 'string' ? body.content.trim() : ''
		const conversationId = body.conversationId

		// Wrong data

		if (!conversationId || !content) {
			return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
		}

		// Check if user is part of the conversation

		const sender = await prisma.conversationMember.findFirst({
			where: {
				conversationId,
				userId
			},
			include: {
				user: true
			}
		})

		if (!sender) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
		}

		const message = await prisma.message.create({
			data: {
				conversationId,
				senderId: userId,
				content
			},
			include: {
				sender: true
			}
		})

		await prisma.conversation.update({
			where: {
				id: message.conversationId
			},
			data: {
				lastMessageAt: message.createdAt,
				lastMessagePreview: message.content,
				lastMessageAuthorId: message.senderId,
				lastMessageAuthorName: message.sender.name
			}
		})

		const updatedConversation = await prisma.conversation.findFirst({
			where: {
				id: message.conversationId
			},
			include: {
				members: {
					include: {
						user: true
					}
				}
			}
		})

		if (!updatedConversation) {
			return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
		}

		updatedConversation.members.forEach(member => {
			if (member.user.id) {
				pusherServer.trigger(`user-${member.user.id}`, PUSHER_KEYS.NEW_MESSAGE, {
					message
				})
			}
		})

		return NextResponse.json({ message }, { status: 201 })
	} catch (error) {
		console.error('[SEND_MESSAGE_ERROR]', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

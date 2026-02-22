import { auth } from '@/auth'
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

		const optimisticId = body.optimisticId

		// Wrong data

		if (!conversationId || !content) {
			return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
		}

		// Check if user is part of the conversation

		const isMember = await prisma.conversationMember.findFirst({
			where: {
				conversationId,
				userId
			}
		})

		if (!isMember) {
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
				lastMessagePreview: message.content
			}
		})

		await pusherServer.trigger(message.conversationId, 'messages:new', message)

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

		updatedConversation?.members.forEach(member => {
			pusherServer.trigger(member.user.email!, 'conversation:update', {
				id: updatedConversation.id,
				messages: [message]
			})
		})

		return NextResponse.json({ message }, { status: 201 })
	} catch (error) {
		console.error('[SEND_MESSAGE_ERROR]', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

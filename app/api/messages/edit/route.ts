import { auth } from '@/auth'
import { PUSHER_KEYS } from '@/config/pusherKeys'
import { prisma } from '@/db/prisma'
import { pusherServer } from '@/lib/pusher/pusher'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
	try {
		/**
		 * 1️⃣ Auth check
		 */
		const session = await auth.api.getSession({ headers: await headers() })
		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const userId = session.user.id

		/**
		 * 2️⃣ Body validation
		 */
		const body = await req.json()
		const { messageId, content } = body as {
			messageId?: string
			content?: string
		}

		if (!messageId || typeof content !== 'string') {
			return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
		}

		/**
		 * 3️⃣ Fetch message + conversation
		 */
		const message = await prisma.message.findUnique({
			where: { id: messageId },
			include: {
				conversation: true,
				sender: true
			}
		})

		if (!message) {
			return NextResponse.json({ error: 'Message not found' }, { status: 404 })
		}

		/**
		 * 4️⃣ Ownership check
		 */
		if (message.senderId !== userId) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
		}

		const conversationId = message.conversationId

		/**
		 * 5️⃣ Membership check (extra safety)
		 */
		const isMember = await prisma.conversationMember.findUnique({
			where: {
				conversationId_userId: {
					conversationId,
					userId
				}
			}
		})

		if (!isMember) {
			return NextResponse.json({ error: 'Not a conversation member' }, { status: 403 })
		}

		/**
		 * 6️⃣ Update message
		 */
		const updatedMessage = await prisma.message.update({
			where: { id: messageId },
			data: {
				content,
				updatedAt: new Date()
			}
		})

		/**
		 * 7️⃣ If this is the last message → update conversation preview
		 */
		const lastMessage = await prisma.message.findFirst({
			where: { conversationId },
			orderBy: { createdAt: 'desc' }
		})

		if (lastMessage?.id === messageId) {
			await prisma.conversation.update({
				where: { id: conversationId },
				data: {
					lastMessageAt: updatedMessage.createdAt,
					lastMessagePreview: content,
					lastMessageAuthorId: updatedMessage.senderId,
					lastMessageAuthorName: message.sender?.name ?? null
				}
			})
		}

		// Pusher

		const updatedConversation = await prisma.conversation.findFirst({
			where: {
				id: conversationId
			},
			include: {
				members: true
			}
		})

		if (updatedConversation && updatedConversation.members) {
			for (const member of updatedConversation.members) {
				pusherServer.trigger(`user-${member.userId}`, PUSHER_KEYS.EDIT_MESSAGE, {
					messageId: updatedMessage.id,
					messageContent: updatedMessage.content,
					conversationId,
					lastMessage
				})
			}
		}

		return NextResponse.json({ message: updatedMessage }, { status: 200 })
	} catch (error) {
		console.error('[EDIT_MESSAGE_ERROR]', error)
		return NextResponse.json({ error: 'Failed to edit message' }, { status: 500 })
	}
}

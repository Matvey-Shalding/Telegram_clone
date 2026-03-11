import { PUSHER_KEYS } from '@/config/pusherKeys'
import { prisma } from '@/db/prisma'
import { pusherServer } from '@/lib/pusher/pusher'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
	try {
		const body = await req.json()
		const messageId = body.messageId as string | undefined

		if (!messageId) {
			return NextResponse.json({ error: 'messageId is required' }, { status: 400 })
		}

		// Make sure message exists and get its conversationId
		const message = await prisma.message.findUnique({
			where: { id: messageId }
		})

		if (!message) {
			return NextResponse.json({ error: 'Message not found' }, { status: 404 })
		}

		const conversationId = message.conversationId

		// Perform deletion
		await prisma.message.delete({
			where: { id: messageId }
		})

		// Find the latest remaining message in this conversation (if any)
		const latest = await prisma.message.findFirst({
			where: { conversationId },
			orderBy: { createdAt: 'desc' },
			include: { sender: true } // to get author name/id if needed
		})

		// Update conversation's lastMessage fields (either set to latest or clear)
		if (latest) {
			await prisma.conversation.update({
				where: { id: conversationId },
				data: {
					lastMessageAt: latest.createdAt,
					lastMessagePreview: latest.content ?? null,
					lastMessageAuthorId: latest.senderId,
					lastMessageAuthorName: latest.sender?.name ?? null
				}
			})
		} else {
			// No messages left in conversation — clear the lastMessage fields
			await prisma.conversation.update({
				where: { id: conversationId },
				data: {
					lastMessageAt: null,
					lastMessagePreview: null,
					lastMessageAuthorId: null,
					lastMessageAuthorName: null
				}
			})
		}

		// Pusher

		// 1) delete the message from all members of conversation

		const updatedConversation = await prisma.conversation.findFirst({
			where: { id: conversationId },
			include: {
				members: true
			}
		})

		const latestPreview = latest ? (latest.content ?? (latest.image ? 'Sent an image' : null)) : null

		if (updatedConversation) {
			for (const member of updatedConversation.members) {
				pusherServer.trigger(`user-${member.userId}`, PUSHER_KEYS.DELETE_MESSAGE, {
					messageId,
					conversationId,
					lastMessage: latest ? { ...latest, content: latestPreview } : null
				})
			}
		}

		return NextResponse.json({}, { status: 200 })
	} catch (error) {
		console.error('[ERROR IN DELETE MESSAGE]', error)
		return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 })
	}
}

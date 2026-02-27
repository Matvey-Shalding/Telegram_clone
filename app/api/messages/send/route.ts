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

		if (!userId) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const body = await req.json()

		const conversationId: string | undefined = body.conversationId
		const rawContent = typeof body.content === 'string' ? body.content.trim() : null
		const imageUrl: string | null = typeof body.imageUrl === 'string' ? body.imageUrl : null

		// Must have conversationId
		if (!conversationId) {
			return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
		}

		// Enforce: text-only OR image-only
		const isTextMessage = !!rawContent && !imageUrl
		const isImageMessage = !rawContent && !!imageUrl

		if (!isTextMessage && !isImageMessage) {
			return NextResponse.json({ error: 'Message must contain either text or image (not both)' }, { status: 400 })
		}

		// Check membership
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

		// Create message
		const message = await prisma.message.create({
			data: {
				conversationId,
				senderId: userId,
				content: isTextMessage ? rawContent : null,
				image: isImageMessage ? imageUrl : null
			},
			include: {
				sender: true
			}
		})

		// Update conversation preview
		await prisma.conversation.update({
			where: { id: conversationId },
			data: {
				lastMessageAt: message.createdAt,
				lastMessagePreview: isTextMessage ? message.content : 'Sent an image',
				lastMessageAuthorId: message.senderId,
				lastMessageAuthorName: message.sender.name
			}
		})

		// Notify members
		const updatedConversation = await prisma.conversation.findFirst({
			where: { id: conversationId },
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
			pusherServer.trigger(`user-${member.user.id}`, PUSHER_KEYS.NEW_MESSAGE, { message })
		})

		return NextResponse.json({ message }, { status: 201 })
	} catch (error) {
		console.error('[SEND_MESSAGE_ERROR]', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

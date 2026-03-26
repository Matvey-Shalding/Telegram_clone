export const dynamic = 'force-dynamic'

import { auth } from '@/auth'
import { prisma } from '@/db/prisma'
import { getConversationTitle } from '@/lib/conversation.helpers'
import { NextRequest, NextResponse } from 'next/server'

export type SonnerData = {
	title: string
	isGroup: boolean
	senderName: string
	content: string | null
	image: string | null
	createdAt: Date
	senderAvatar: string | null
}

// Expects POST with { messageId: string }
export async function POST(req: NextRequest) {
	try {
		const { messageId } = await req.json()

		if (!messageId) return NextResponse.json({ error: 'No messageId provided' }, { status: 400 })

		const session = await auth.api.getSession({ headers: req.headers })
		const userId = session?.user?.id

		if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

		// Fetch the message
		const message = await prisma.message.findUnique({ where: { id: messageId } })
		if (!message) return NextResponse.json({ error: 'Message not found' }, { status: 404 })

		if (message.senderId === userId) return NextResponse.json({ data: null })

		// Fetch conversation + members
		const conversation = await prisma.conversation.findFirst({
			where: { id: message.conversationId },
			include: { members: { include: { user: true } } }
		})

		if (!conversation) return NextResponse.json({ data: null })

		// Fetch sender
		const sender = await prisma.user.findFirst({ where: { id: message.senderId } })
		if (!sender) return NextResponse.json({ data: null })

		const data: SonnerData = {
			title: getConversationTitle(conversation, conversation.members, userId),
			isGroup: conversation.isGroup,
			senderName: sender.name,
			content: message.content,
			image: message.image,
			createdAt: message.createdAt,
			senderAvatar: sender.image
		}

		return NextResponse.json({ data })
	} catch (err) {
		console.error(err)
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
	}
}

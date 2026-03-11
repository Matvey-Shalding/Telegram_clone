'use server'

import { auth } from '@/auth'
import { prisma } from '@/db/prisma'
import { Message } from '@/generated/prisma/client'
import { getConversationTitle } from '@/lib/conversation.helpers'
import { headers } from 'next/headers'

export type SonnerData = {
	title: string
	isGroup: boolean
	senderName: string
	content: string | null
	image: string | null
	createdAt: Date
}

export async function getSonnerData(message: Message): Promise<SonnerData | null> {
	const userId = await auth.api.getSession({ headers: await headers() }).then(res => res?.user?.id)

	if (!userId) {
		return null
	}

	const conversation = await prisma.conversation.findFirst({
		where: { id: message.conversationId },
		include: {
			members: {
				include: { user: true }
			}
		}
	})

	if (!conversation) return null

	const sender = await prisma.user.findFirst({
		where: { id: message.senderId }
	})

	if (!sender) return null

	return {
		title: getConversationTitle(conversation, conversation.members, userId),
		isGroup: conversation.isGroup,
		senderName: sender.name,
		content: message.content,
		image: message.image,
		createdAt: message.createdAt
	}
}

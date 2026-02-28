'use server'

import { auth } from '@/auth'
import { prisma } from '@/db/prisma'
import { Message } from '@/generated/prisma/client'
import { headers } from 'next/headers'
import { getConversationTitle } from './conversation.helpers'

export const getMessageSonnerPayload = async (message: Message) => {
	const userId = await auth.api.getSession({ headers: await headers() }).then(res => res?.user?.id)

	if (!userId || userId === message.senderId) return null

	const conversation = await prisma.conversation.findFirst({
		where: { id: message.conversationId },
		include: { members: { include: { user: true } } }
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

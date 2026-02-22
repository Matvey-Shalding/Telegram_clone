'use server'

import { Chat } from '@/@types/Chat'
import { auth } from '@/auth'
import { prisma } from '@/db/prisma'
import { Message } from '@/generated/prisma/client'
import { headers } from 'next/headers'
import { Conversation } from './conversation'

export const getMessageSonnerPayload = async (message: Message) => {
	const userId = await auth.api.getSession({ headers: await headers() }).then(res => res?.user?.id)

	if (!userId || userId === message.senderId) return null

	const conversation = await prisma.conversation.findFirst({
		where: { id: message.conversationId },
		include: { members: { include: { user: true } } }
	})

	if (!conversation) return null

	const conversationService = new Conversation(conversation as Chat)

	const sender = await prisma.user.findFirst({
		where: { id: message.senderId }
	})
	if (!sender) return null

	return {
		title: conversationService.getTitle(conversation.members, userId),
		isGroup: conversation.isGroup,
		senderName: sender.name,
		content: message.content,
		image: message.image,
		createdAt: message.createdAt
	}
}

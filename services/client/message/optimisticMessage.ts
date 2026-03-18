'use client'

import { ServerMessage } from '@/@types/Message'
import { MessageReaction } from '@/generated/prisma/client'
import { generateId } from '@/lib/utils'
import { QueryClient } from '@tanstack/react-query'
import { MessageCacheService } from './messageCache'

export class MessagesOptimisticService {
	static createOptimisticMessage(conversationId: string, userId: string, content?: string | null, image?: string | null) {
		const clientId = generateId()

		const optimistic: ServerMessage & { clientId: string } = {
			id: `temp:${clientId}`,
			clientId,
			conversationId,
			senderId: userId,
			content: content ?? null,
			image: image ?? null,
			createdAt: new Date(),
			updatedAt: new Date(),
			reactions: []
		}

		return { optimistic, clientId }
	}

	static replaceOptimisticMessage(queryClient: QueryClient, conversationId: string, clientId: string, serverMessage: ServerMessage) {
		const messages = MessageCacheService.getMessages(queryClient, conversationId)

		const filtered = messages.filter(m => (m as ServerMessage & { clientId?: string }).clientId !== clientId)

		const updated = [...filtered, serverMessage].sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt))

		MessageCacheService.setMessages(queryClient, conversationId, updated)
	}

	static addReactionOptimistic(queryClient: QueryClient, conversationId: string, messageId: string, userId: string, emoji: string) {
		const previousMessages = MessageCacheService.getMessages(queryClient, conversationId)

		const clientId = generateId()

		const reaction: MessageReaction = {
			id: clientId,
			messageId,
			userId,
			reaction: emoji,
			createdAt: new Date()
		}

		MessageCacheService.updateMessage(queryClient, conversationId, messageId, m => ({
			...m,
			reactions: [...(m.reactions.filter(r => r.userId !== userId) ?? []), reaction]
		}))

		return { previousMessages, clientId }
	}

	static rollbackReaction(queryClient: QueryClient, conversationId: string, previousMessages: ServerMessage[]) {
		MessageCacheService.setMessages(queryClient, conversationId, previousMessages)
	}

	static removeOptimisticReaction(queryClient: QueryClient, conversationId: string, messageId: string, clientId: string) {
		MessageCacheService.updateMessage(queryClient, conversationId, messageId, m => ({
			...m,
			reactions: (m.reactions ?? []).filter(r => r.id !== clientId)
		}))
	}
}

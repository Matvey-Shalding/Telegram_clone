'use client'

import { ServerMessage } from '@/@types/Message'
import { ReactionWithUser } from '@/@types/ReactionWithUser'
import { generateId } from '@/lib/utils'
import { QueryClient } from '@tanstack/react-query'
import { User } from 'better-auth'
import { MessageCacheService } from './messageCache'

export class MessagesOptimisticService {
	static createOptimisticMessage(conversationId: string, user?: User, content?: string | null, image?: string | null) {
		const clientId = generateId()

		if (!user) throw new Error('No user')

		const userSafe = {
			...user,
			image: user?.image ?? null
		}

		const optimistic: ServerMessage & { clientId: string } = {
			id: `temp:${clientId}`,
			clientId,
			conversationId,
			senderId: user.id,
			content: content ?? null,
			image: image ?? null,
			createdAt: new Date(),
			updatedAt: new Date(),
			reactions: [],
			sender: userSafe
		}

		return { optimistic, clientId }
	}

	static replaceOptimisticMessage(queryClient: QueryClient, conversationId: string, clientId: string, serverMessage: ServerMessage) {
		const messages = MessageCacheService.getMessages(queryClient, conversationId)

		const filtered = messages.filter(m => (m as ServerMessage & { clientId?: string }).clientId !== clientId)

		const updated = [...filtered, serverMessage].sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt))

		MessageCacheService.setMessages(queryClient, conversationId, updated)
	}

	static addReactionOptimistic(queryClient: QueryClient, conversationId: string, messageId: string, emoji: string, user?: User) {
		const previousMessages = MessageCacheService.getMessages(queryClient, conversationId)

		const clientId = generateId()

		if (!user) throw new Error('No user')

		const userSafe = {
			...user,
			image: user?.image ?? null
		}

		const reaction: ReactionWithUser = {
			id: clientId,
			messageId,
			reaction: emoji,
			createdAt: new Date(),
			user: userSafe,
			userId: userSafe.id
		}

		MessageCacheService.updateMessage(queryClient, conversationId, messageId, m => ({
			...m,
			reactions: [...(m.reactions.filter(r => r.userId !== user.id) ?? []), reaction]
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

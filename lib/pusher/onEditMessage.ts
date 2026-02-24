import { ServerMessage } from '@/@types/ChatMessage'
import { REACT_QUERY_KEYS } from '@/config/reactQueryKeys'
import { Conversation } from '@/generated/prisma/client'
import { QueryClient } from '@tanstack/react-query'

interface EditMessagePayload {
	messageId: string
	messageContent: string | null
	conversationId: string
	lastMessage?: {
		id: string
		content: string | null
		createdAt: Date
		senderId: string
		sender?: {
			name?: string | null
		}
	} | null
}

export const onEditMessage = (queryClient: QueryClient) => async (payload: EditMessagePayload) => {
	const { messageId, messageContent, conversationId, lastMessage } = payload

	/**
	 * 1️⃣ Update messages cache
	 */
	queryClient.setQueryData<ServerMessage[]>([REACT_QUERY_KEYS.MESSAGES, conversationId], old =>
		old?.map(m =>
			m.id === messageId
				? {
						...m,
						content: messageContent,
						updatedAt: new Date()
					}
				: m
		)
	)

	/**
	 * 2️⃣ Update conversations cache IF last message changed
	 */
	if (!lastMessage) return

	queryClient.setQueryData<Conversation[] | undefined>([REACT_QUERY_KEYS.CHATS], old => {
		if (!old) return old

		return old.map(conv => {
			if (conv.id !== conversationId) return conv
			if (conv.lastMessagePreview === lastMessage.content) return conv

			return {
				...conv,
				lastMessageAt: lastMessage.createdAt,
				lastMessagePreview: lastMessage.content ?? '',
				lastMessageAuthorId: lastMessage.senderId,
				lastMessageAuthorName: lastMessage.sender?.name ?? null
			}
		})
	})
}

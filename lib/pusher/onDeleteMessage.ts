import { ServerMessage } from '@/@types/Message'
import { REACT_QUERY_KEYS } from '@/config/reactQueryKeys'
import { Conversation, Message, User } from '@/generated/prisma/client'
import { Api } from '@/services/backend/clientApi'
import { UnreadCountResponse } from '@/services/backend/conversations'
import { QueryClient } from '@tanstack/react-query'

interface DeleteMessagePayload {
	messageId: string
	conversationId: string
	lastMessage: (Message & { sender: User }) | null
}

export const onDeleteMessage = (queryClient: QueryClient) => async (payload: DeleteMessagePayload) => {
	const { messageId, conversationId, lastMessage } = payload

	// 1️⃣ Update messages cache
	queryClient.setQueryData<ServerMessage[]>([REACT_QUERY_KEYS.MESSAGES, conversationId], old => old?.filter(m => m.id !== messageId))

	// update unread count

	const { count } = await Api.conversation.getUnreadCount(conversationId)

	if (count) {
		queryClient.setQueryData<UnreadCountResponse>([REACT_QUERY_KEYS.UNREAD_COUNT, conversationId], { count })
	}

	// 2️⃣ Update chats (lastMessage preview)
	queryClient.setQueryData<Conversation[] | undefined>([REACT_QUERY_KEYS.CHATS], old => {
		if (!old) return old

		return old.map(conv => {
			if (conv.id !== conversationId) return conv

			if (!lastMessage) {
				// No messages left
				return {
					...conv,
					lastMessageAt: null,
					lastMessagePreview: null,
					lastMessageAuthorId: null,
					lastMessageAuthorName: null
				}
			}

			return {
				...conv,
				lastMessageAt: lastMessage.createdAt,
				lastMessagePreview: lastMessage?.content || 'Sent an image',
				lastMessageAuthorId: lastMessage.senderId,
				lastMessageAuthorName: lastMessage.sender.name
			}
		})
	})
}

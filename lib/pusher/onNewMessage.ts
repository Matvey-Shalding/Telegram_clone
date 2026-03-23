import { PusherMessage } from '@/@types/Message'
import { MessageSonner } from '@/components/shared/chat/ui/MessageSonner'
import { REACT_QUERY_KEYS } from '@/config/reactQueryKeys'
import { Conversation, Message } from '@/generated/prisma/client'
import { Api } from '@/services/backend/clientApi'
import { UnreadCountResponse } from '@/services/backend/conversations'
import { QueryClient } from '@tanstack/react-query'
import { getSonnerData } from '../server/getSonnerData'

export const onNewMessage = (queryClient: QueryClient, currentConversationId?: string) => async (payload: { message: PusherMessage }) => {
	const message = payload.message
	if (!message) return

	const conversationId = message.conversationId
	if (!conversationId) return

	// 1️⃣ Update messages cache
	queryClient.setQueryData<Message[]>([REACT_QUERY_KEYS.MESSAGES, conversationId], old => {
		if (old?.some(m => m.id === message.id)) return old
		return [...(old ?? []), message]
	})

	// update unreadCount

	const { count } = await Api.conversation.getUnreadCount(conversationId)

	if (count) {
		queryClient.setQueryData<UnreadCountResponse>([REACT_QUERY_KEYS.UNREAD_COUNT, conversationId], { count })
	}

	// mark new message as seen if user is in conversation

	if (currentConversationId && currentConversationId === conversationId) {
		console.log(conversationId, currentConversationId)
		await Api.conversation.updateLastReadAt(conversationId)
	}

	// 2️⃣ Update conversations (chats) cache
	queryClient.setQueryData<Conversation[] | undefined>([REACT_QUERY_KEYS.CHATS], old => {
		if (!old) return old

		return old.map(conv => {
			if (conv.id !== conversationId) return conv
			return {
				...conv,
				lastMessageAt: message.createdAt,
				lastMessagePreview: message.content ?? 'Sent an image',
				lastMessageAuthorId: message.senderId,
				lastMessageAuthorName: message.sender?.name ?? null
			}
		})
	})

	// 3️⃣ Show toast notification
	try {
		const toastData = await getSonnerData(message)
		if (toastData) MessageSonner(toastData)
	} catch (e) {
		console.error('Toast error', e)
	}
}

import { PusherMessage } from '@/@types/ChatMessage'
import { REACT_QUERY_KEYS } from '@/config/reactQueryKeys'
import { Conversation, Message } from '@/generated/prisma/client'
import { getMessageSonnerPayload } from '@/lib/getMessageSonnerPayload'
import { showMessageToast } from '@/lib/showMessageSonner'
import { QueryClient } from '@tanstack/react-query'

export const onNewMessage = (queryClient: QueryClient) => async (payload: { message: PusherMessage }) => {
	const message = payload.message
	if (!message) return

	const conversationId = message.conversationId
	if (!conversationId) return

	// 1️⃣ Update messages cache
	queryClient.setQueryData<Message[]>([REACT_QUERY_KEYS.MESSAGES, conversationId], old => {
		if (old?.some(m => m.id === message.id)) return old
		return [...(old ?? []), message]
	})

	// 2️⃣ Update conversations (chats) cache
	queryClient.setQueryData<Conversation[] | undefined>([REACT_QUERY_KEYS.CHATS], old => {
		if (!old) return old

		return old.map(conv => {
			if (conv.id !== conversationId) return conv
			return {
				...conv,
				lastMessageAt: message.createdAt,
				lastMessagePreview: message.content ?? '',
				lastMessageAuthorId: message.senderId,
				lastMessageAuthorName: message.sender?.name ?? null
			}
		})
	})

	// 3️⃣ Show toast notification
	try {
		const toastData = await getMessageSonnerPayload(message)
		if (toastData) showMessageToast(toastData)
	} catch (e) {
		console.error('Toast error', e)
	}
}

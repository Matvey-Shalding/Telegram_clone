import { PusherMessage } from '@/@types/Message'
import { MessageSonner } from '@/components/shared/chat/ui/MessageSonner'
import { REACT_QUERY_KEYS } from '@/config/reactQueryKeys'
import { Conversation, Message } from '@/generated/prisma/client'
import { Api } from '@/services/backend/clientApi'
import { UnreadCountResponse } from '@/services/backend/conversations'
import { QueryClient } from '@tanstack/react-query'

// -----------------------------
// Client-side fetch for Sonner toast
// -----------------------------
async function fetchSonnerData(messageId: string) {
	try {
		const res = await fetch('/api/messages/sonner', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ messageId })
		})

		const json = await res.json()
		return json.data as {
			title: string
			isGroup: boolean
			senderName: string
			content: string | null
			image: string | null
			createdAt: Date
			senderAvatar: string | null
		} | null
	} catch (err) {
		console.error('Failed to fetch Sonner data', err)
		return null
	}
}

// -----------------------------
// Pusher message handler
// -----------------------------
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

	// 2️⃣ Update unread count
	const { count } = await Api.conversation.getUnreadCount(conversationId)
	if (count) {
		queryClient.setQueryData<UnreadCountResponse>([REACT_QUERY_KEYS.UNREAD_COUNT, conversationId], { count })
	}

	// 3️⃣ Mark new message as seen if user is in conversation
	if (currentConversationId && currentConversationId === conversationId) {
		await Api.conversation.updateLastReadAt(conversationId)
	}

	// 4️⃣ Update conversations (chats) cache
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

	// 5️⃣ Show toast notification via server route
	try {
		const toastData = await fetchSonnerData(message.id)
		if (toastData) MessageSonner(toastData)
	} catch (e) {
		console.error('Toast error', e)
	}
}

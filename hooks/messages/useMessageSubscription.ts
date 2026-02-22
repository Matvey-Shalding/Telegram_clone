import { Message } from '@/generated/prisma/client'
import { getMessageSonnerPayload } from '@/lib/getMessageSonnerPayload'
import { pusherClient } from '@/lib/pusher'
import { showMessageSonner } from '@/lib/showMessageSonner'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

export const useMessageSubscription = (conversationId: string | undefined, scrollToBottom: () => void) => {
	const queryClient = useQueryClient()

	useEffect(() => {
		if (!conversationId) return

		const messageHandler = async (message: Message) => {
			// Update React Query cache
			queryClient.setQueryData<Message[]>(['messages', conversationId], old => {
				const exists = old?.some(m => m.id === message.id)
				if (exists) return old
				return [...(old ?? []), message]
			})

			// Scroll to bottom
			scrollToBottom()

			// Show notification if needed
			try {
				const sonnerData = await getMessageSonnerPayload(message)
				if (sonnerData) showMessageSonner(sonnerData)
			} catch (err) {
				console.error('Sonner error', err)
			}
		}

		// Subscribe to Pusher
		pusherClient.subscribe(conversationId)
		pusherClient.bind('messages:new', messageHandler)

		// Cleanup on unmount or conversation change
		return () => {
			pusherClient.unbind('messages:new', messageHandler)
			pusherClient.unsubscribe(conversationId)
		}
	}, [conversationId, queryClient])
}

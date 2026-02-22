import { authClient } from '@/auth-client'
import { Message } from '@/generated/prisma/client'
import { getMessageSonnerPayload } from '@/lib/getMessageSonnerPayload'
import { pusherClient } from '@/lib/pusher'
import { showMessageToast } from '@/lib/showMessageSonner'
import { useQueryClient } from '@tanstack/react-query'
import React, { useEffect } from 'react'

interface Props {
	className?: string
}

export const PusherProvider: React.FC<Props> = ({ className }) => {
	const queryClient = useQueryClient()
	const userId = authClient.useSession().data?.user.id

	useEffect(() => {
		if (!userId) return

		const channelName = `user-${userId}`
		pusherClient.subscribe(channelName)

		const messageHandler = async (payload: { message: Message }) => {
			const message = payload.message // ✅ destructure correctly
			if (!message) return

			const conversationId = message.conversationId
			if (!conversationId) return

			// Update React Query cache
			queryClient.setQueryData<Message[]>(['messages', conversationId], old => {
				const exists = old?.some(m => m.id === message.id)
				if (exists) return old
				return [...(old ?? []), message]
			})

			// Show notification
			try {
				const sonnerData = await getMessageSonnerPayload(message)
				if (sonnerData) showMessageToast(sonnerData)
			} catch (err) {
				console.error('Sonner error', err)
			}
		}

		pusherClient.bind('messages:new', messageHandler)

		return () => {
			pusherClient.unbind('messages:new', messageHandler)
			pusherClient.unsubscribe(channelName)
		}
	}, [userId, queryClient])

	return null
}

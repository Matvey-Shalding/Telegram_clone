'use client'

import { authClient } from '@/auth-client'
import { createPusherHandlers } from '@/lib/pusher/eventHandlers'
import { pusherClient } from '@/lib/pusher/pusher'
import { currentConversationId } from '@/store'
import { useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { useEffect } from 'react'

export const PusherProvider = () => {
	const queryClient = useQueryClient()
	const userId = authClient.useSession().data?.user.id

	const [conversationId] = useAtom(currentConversationId)

	useEffect(() => {
		if (!userId) return

		const channelName = `user-${userId}`
		const handlers = createPusherHandlers(queryClient, conversationId)

		pusherClient.subscribe(channelName)

		Object.entries(handlers).forEach(([event, handler]) => {
			pusherClient.bind(event, handler)
		})

		return () => {
			Object.entries(handlers).forEach(([event, handler]) => {
				pusherClient.unbind(event, handler)
			})
			pusherClient.unsubscribe(channelName)
		}
	}, [userId, queryClient, conversationId])

	return null
}

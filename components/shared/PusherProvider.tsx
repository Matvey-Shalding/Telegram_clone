'use client'

import { authClient } from '@/auth-client'
import { pusherClient } from '@/lib/pusher'
import { createPusherHandlers } from '@/lib/pusher/eventHandlers'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

export const PusherProvider = () => {
	const queryClient = useQueryClient()
	const userId = authClient.useSession().data?.user.id

	useEffect(() => {
		if (!userId) return

		const channelName = `user-${userId}`
		const handlers = createPusherHandlers(queryClient)

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
	}, [userId, queryClient])

	return null
}

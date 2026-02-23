import { PUSHER_KEYS } from '@/config/pusherKeys'
import { QueryClient } from '@tanstack/react-query'
import { onNewMessage } from './onNewMessage'

export const createPusherHandlers = (queryClient: QueryClient) => ({
	[PUSHER_KEYS.NEW_MESSAGE]: onNewMessage(queryClient)
})

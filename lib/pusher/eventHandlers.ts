import { PUSHER_KEYS } from '@/config/pusherKeys'
import { QueryClient } from '@tanstack/react-query'
import { onDeleteMessage } from './onDeleteMessage'
import { onNewMessage } from './onNewMessage'

export const createPusherHandlers = (queryClient: QueryClient) => ({
	[PUSHER_KEYS.NEW_MESSAGE]: onNewMessage(queryClient),
	[PUSHER_KEYS.DELETE_MESSAGE]: onDeleteMessage(queryClient)
})

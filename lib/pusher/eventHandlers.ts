import { PUSHER_KEYS } from '@/config/pusherKeys'
import { QueryClient } from '@tanstack/react-query'
import { onDeleteMessage } from './onDeleteMessage'
import { onEditMessage } from './onEditMessage'
import { onNewLastReadAt } from './onNewLastReadAt'
import { onNewMessage } from './onNewMessage'

export const createPusherHandlers = (queryClient: QueryClient) => ({
	[PUSHER_KEYS.NEW_MESSAGE]: onNewMessage(queryClient),
	[PUSHER_KEYS.DELETE_MESSAGE]: onDeleteMessage(queryClient),
	[PUSHER_KEYS.EDIT_MESSAGE]: onEditMessage(queryClient),
	[PUSHER_KEYS.NEW_LAST_READ_AT]: onNewLastReadAt(queryClient)
})

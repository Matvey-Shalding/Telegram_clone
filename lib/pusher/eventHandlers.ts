import { PUSHER_KEYS } from '@/config/pusherKeys'
import { QueryClient } from '@tanstack/react-query'
import { onDeleteConversation } from './onDeleteConversation'
import { onDeleteMessage } from './onDeleteMessage'
import { onEditMessage } from './onEditMessage'
import { onLeaveConversation } from './onLeaveConversation'
import { onNewLastReadAt } from './onNewLastReadAt'
import { onNewMessage } from './onNewMessage'
import { onNewReaction } from './onNewReaction'
import { onNewGroup } from './onNewGroup'

export const createPusherHandlers = (queryClient: QueryClient, conversationId?: string) => ({
	[PUSHER_KEYS.NEW_MESSAGE]: onNewMessage(queryClient, conversationId),
	[PUSHER_KEYS.DELETE_MESSAGE]: onDeleteMessage(queryClient),
	[PUSHER_KEYS.EDIT_MESSAGE]: onEditMessage(queryClient),
	[PUSHER_KEYS.NEW_LAST_READ_AT]: onNewLastReadAt(queryClient),
	[PUSHER_KEYS.NEW_REACTION]: onNewReaction(queryClient),
	[PUSHER_KEYS.LEAVE_CONVERSATION]: onLeaveConversation(queryClient),
	[PUSHER_KEYS.DELETE_CONVERSATION]: onDeleteConversation(queryClient),
	[PUSHER_KEYS.NEW_CONVERSATION]: onNewGroup(queryClient)
})

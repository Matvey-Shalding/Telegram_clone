import { REACT_QUERY_KEYS } from '@/config/reactQueryKeys'
import { UnreadCountResponse } from '@/services/backend/conversations'
import { QueryClient } from '@tanstack/react-query'

export const onNewLastReadAt = (queryClient: QueryClient) => async (payload: { conversationId: string; lastReadAt: Date }) => {
	const { conversationId, lastReadAt } = payload

	if (!conversationId || !lastReadAt) return

	queryClient.setQueryData<Date | null>([REACT_QUERY_KEYS.LAST_READ_AT, conversationId], lastReadAt)

	queryClient.setQueryData<UnreadCountResponse>([REACT_QUERY_KEYS.UNREAD_COUNT, conversationId], { count: 0 })
}

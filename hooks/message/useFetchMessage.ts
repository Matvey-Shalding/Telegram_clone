'use client'

import { ServerMessage } from '@/@types/Message'
import { REACT_QUERY_KEYS } from '@/config/reactQueryKeys'
import { Api } from '@/services/backend/clientApi'
import { currentConversationId } from '@/store'
import { useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'

export function useFetchMessages() {
	const [conversationId] = useAtom(currentConversationId)

	return useQuery<ServerMessage[]>({
		queryKey: [REACT_QUERY_KEYS.MESSAGES, conversationId],
		queryFn: async () => Api.messages.getAll(conversationId!),
		enabled: !!conversationId,
		staleTime: 10000,
		refetchOnWindowFocus: false
	})
}

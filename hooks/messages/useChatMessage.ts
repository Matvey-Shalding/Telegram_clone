'use client'

import { REACT_QUERY_KEYS } from '@/config/reactQueryKeys'
import { Message } from '@/generated/prisma/client'
import { Api } from '@/services/clientApi'
import { currentConversationId } from '@/store'
import { useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'

export function useChatMessages() {
	const [conversationId] = useAtom(currentConversationId)

	return useQuery<Message[]>({
		queryKey: [REACT_QUERY_KEYS.MESSAGES, conversationId],
		queryFn: async () => Api.messages.getAll(conversationId!),
		enabled: !!conversationId,
		staleTime: 10000,
		refetchOnWindowFocus: false
	})
}

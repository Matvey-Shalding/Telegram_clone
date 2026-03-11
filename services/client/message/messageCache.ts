'use client'

import { ServerMessage } from '@/@types/Message'
import { REACT_QUERY_KEYS } from '@/config/reactQueryKeys'
import { QueryClient } from '@tanstack/react-query'

export class MessageCacheService {
	static getMessages(queryClient: QueryClient, conversationId: string) {
		return queryClient.getQueryData<ServerMessage[]>([REACT_QUERY_KEYS.MESSAGES, conversationId]) ?? []
	}

	static setMessages(queryClient: QueryClient, conversationId: string, messages: ServerMessage[]) {
		queryClient.setQueryData([REACT_QUERY_KEYS.MESSAGES, conversationId], messages)
	}

	static addMessage(queryClient: QueryClient, conversationId: string, message: ServerMessage) {
		queryClient.setQueryData<ServerMessage[]>([REACT_QUERY_KEYS.MESSAGES, conversationId], old => [...(old ?? []), message])
	}

	static deleteMessage(queryClient: QueryClient, conversationId: string, messageId: string) {
		queryClient.setQueryData<ServerMessage[]>([REACT_QUERY_KEYS.MESSAGES, conversationId], old => old?.filter(m => m.id !== messageId))
	}

	static updateMessage(queryClient: QueryClient, conversationId: string, messageId: string, updater: (m: ServerMessage) => ServerMessage) {
		queryClient.setQueryData<ServerMessage[]>([REACT_QUERY_KEYS.MESSAGES, conversationId], old =>
			old?.map(m => (m.id === messageId ? updater(m) : m))
		)
	}
}

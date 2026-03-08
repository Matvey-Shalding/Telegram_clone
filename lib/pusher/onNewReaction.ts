import { ServerMessage } from '@/@types/Message'
import { REACT_QUERY_KEYS } from '@/config/reactQueryKeys'
import { Message, MessageReaction } from '@/generated/prisma/client'
import { QueryClient } from '@tanstack/react-query'

interface Payload {
	conversationId: string
	message: Message & {
		reactions: MessageReaction[]
	}
}

export const onNewReaction = (queryClient: QueryClient) => async (payload: Payload) => {
	const { conversationId, message } = payload

	queryClient.setQueryData<ServerMessage[]>([REACT_QUERY_KEYS.MESSAGES, conversationId], old => {
		if (!old) return old

		return old.map(m =>
			m.id === message.id
				? {
						...m,
						reactions: message.reactions
					}
				: m
		)
	})
}

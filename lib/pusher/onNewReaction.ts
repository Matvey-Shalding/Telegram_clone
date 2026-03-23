import { ServerMessage } from '@/@types/Message'
import { ReactionWithUser } from '@/@types/ReactionWithUser'
import { REACT_QUERY_KEYS } from '@/config/reactQueryKeys'
import { Message } from '@/generated/prisma/client'
import { QueryClient } from '@tanstack/react-query'

interface Payload {
	conversationId: string
	message: Message & {
		reactions: ReactionWithUser[]
	}
}

export const onNewReaction = (queryClient: QueryClient) => async (payload: Payload) => {
	console.log(payload, 'payload data', 'onNewReaction')

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

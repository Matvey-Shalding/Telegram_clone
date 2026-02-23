'use client'

import { REACT_QUERY_KEYS } from '@/config/reactQueryKeys'
import { Message } from '@/generated/prisma/client'
import { generateId } from '@/lib/generateId'
import { Api } from '@/services/clientApi'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface SendResponse {
	message: Message
}

type ClientMessage = Message & {
	clientId?: string
}

export function useSendMessage(conversationId: string | null, userId?: string) {
	const queryClient = useQueryClient()

	const mutation = useMutation({
		mutationFn: async (content: string): Promise<Message> => {
			if (!conversationId) throw new Error('No conversationId provided')

			const res: SendResponse = await Api.messages.send({ conversationId, content })
			return res.message
		},

		onMutate: async (content: string) => {
			if (!conversationId) return

			const clientId = generateId()

			const optimisticMessage: ClientMessage = {
				id: `temp:${clientId}`,
				clientId,
				content,
				conversationId,
				senderId: userId ?? '',
				createdAt: new Date(),
				updatedAt: new Date(),
				image: null
			}

			await queryClient.cancelQueries({
				queryKey: [REACT_QUERY_KEYS.MESSAGES, conversationId]
			})

			const previousMessages = queryClient.getQueryData<ClientMessage[]>([REACT_QUERY_KEYS.MESSAGES, conversationId]) ?? []

			queryClient.setQueryData<ClientMessage[]>([REACT_QUERY_KEYS.MESSAGES, conversationId], old => [...(old ?? []), optimisticMessage])

			return { clientId, previousMessages }
		},

		onError: (_err, _content, ctx) => {
			if (!conversationId || !ctx) return

			queryClient.setQueryData([REACT_QUERY_KEYS.MESSAGES, conversationId], ctx.previousMessages)
		},

		onSuccess: (serverMessage, _content, ctx) => {
			if (!conversationId || !ctx) return

			queryClient.setQueryData<ClientMessage[]>([REACT_QUERY_KEYS.MESSAGES, conversationId], old => {
				const list = old ?? []

				const cleaned = list.filter(m => m.clientId !== ctx.clientId)

				if (cleaned.some(m => m.id === serverMessage.id)) {
					return cleaned
				}

				return [...cleaned, serverMessage].sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt))
			})
		}
	})

	return {
		sendMessage: mutation.mutateAsync,
		isPending: mutation.isPending
	}
}

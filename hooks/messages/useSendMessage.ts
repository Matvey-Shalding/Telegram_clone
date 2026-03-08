'use client'

import { ServerMessage } from '@/@types/Message'
import { REACT_QUERY_KEYS } from '@/config/reactQueryKeys'
import { Message } from '@/generated/prisma/client'
import { generateId } from '@/lib/generateId'
import { Api } from '@/services/clientApi'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface SendResponse {
	message: Message
}

export type SendMessagePayload = {
	content?: string | null
	image?: string | null
}

export function useSendMessage(conversationId: string | null, userId?: string) {
	const queryClient = useQueryClient()

	const mutation = useMutation({
		mutationFn: async (payload: SendMessagePayload): Promise<Message> => {
			if (!conversationId) throw new Error('No conversationId provided')

			const res: SendResponse = await Api.messages.send({
				conversationId,
				content: payload.content ?? '',
				imageUrl: payload.image ?? null
			})

			return res.message
		},

		onMutate: async (payload: SendMessagePayload) => {
			if (!conversationId) return

			const clientId = generateId()

			const optimisticMessage: ServerMessage & { clientId: string } = {
				id: `temp:${clientId}`,
				clientId,
				conversationId,
				senderId: userId ?? '',
				content: payload.content ?? null,
				image: payload.image ?? null,
				createdAt: new Date(),
				updatedAt: new Date()
			}

			await queryClient.cancelQueries({
				queryKey: [REACT_QUERY_KEYS.MESSAGES, conversationId]
			})

			const previousMessages = queryClient.getQueryData<ServerMessage[]>([REACT_QUERY_KEYS.MESSAGES, conversationId]) ?? []

			queryClient.setQueryData<ServerMessage[]>([REACT_QUERY_KEYS.MESSAGES, conversationId], old => [...(old ?? []), optimisticMessage])

			return { clientId, previousMessages }
		},

		onError: (_err, _payload, ctx) => {
			if (!conversationId || !ctx) return

			queryClient.setQueryData([REACT_QUERY_KEYS.MESSAGES, conversationId], ctx.previousMessages)
		},

		onSuccess: (serverMessage, _payload, ctx) => {
			if (!conversationId || !ctx) return

			queryClient.setQueryData<ServerMessage[]>([REACT_QUERY_KEYS.MESSAGES, conversationId], old => {
				const list = old ?? []

				const cleaned = list.filter(m => {
					const withClientId = m as ServerMessage & { clientId?: string }
					return withClientId.clientId !== ctx.clientId
				})

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

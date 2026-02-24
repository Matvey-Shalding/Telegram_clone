'use client'

import { ServerMessage } from '@/@types/ChatMessage'
import { REACT_QUERY_KEYS } from '@/config/reactQueryKeys'
import { Message } from '@/generated/prisma/client'
import { generateId } from '@/lib/generateId'
import { Api } from '@/services/clientApi'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface SendResponse {
	message: Message
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

			const optimisticMessage: ServerMessage = {
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

			const previousMessages = queryClient.getQueryData<ServerMessage[]>([REACT_QUERY_KEYS.MESSAGES, conversationId]) ?? []

			queryClient.setQueryData<ServerMessage[]>([REACT_QUERY_KEYS.MESSAGES, conversationId], old => [...(old ?? []), optimisticMessage])

			return { clientId, previousMessages }
		},

		onError: (_err, _content, ctx) => {
			if (!conversationId || !ctx) return

			queryClient.setQueryData([REACT_QUERY_KEYS.MESSAGES, conversationId], ctx.previousMessages)
		},

		onSuccess: (serverMessage, _content, ctx) => {
			if (!conversationId || !ctx) return

			queryClient.setQueryData<ServerMessage[]>([REACT_QUERY_KEYS.MESSAGES, conversationId], old => {
				const list = old ?? []

				// Clean the messages, removing the optimistic one with this clientId
				const cleaned = list.filter(m => {
					// Narrow m to the extended type with clientId
					const maybeClientMessage = m as Message & { clientId?: string }

					// If m has a clientId, compare it to the ctx.clientId
					if (maybeClientMessage.clientId !== undefined) {
						return maybeClientMessage.clientId !== ctx.clientId
					}

					// Otherwise, keep the message (it’s a regular server message)
					return true
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

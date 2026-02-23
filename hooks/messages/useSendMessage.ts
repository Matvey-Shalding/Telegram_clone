'use client'

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

			// Identifier of optimistic message

			const clientId = generateId()

			const optimisticMessage: Message & { clientId: string } = {
				id: `temp:${clientId}`,
				clientId,
				content,
				conversationId,
				senderId: userId ?? '',
				createdAt: new Date(),
				updatedAt: new Date(),
				image: null
			}

			// stop ongoing refetch

			await queryClient.cancelQueries({ queryKey: [REACT_QUERY_KEYS.MESSAGES, conversationId] })

			// get previous messages

			const previousMessages = queryClient.getQueryData<Message[]>([REACT_QUERY_KEYS.MESSAGES, conversationId]) ?? []

			// add optimistic message

			queryClient.setQueryData<Message[]>([REACT_QUERY_KEYS.MESSAGES, conversationId], old => [...(old ?? []), optimisticMessage])

			return { clientId, previousMessages }
		},

		onError: (_err, _content, ctx) => {
			if (!conversationId || !ctx) return

			// rollback on error

			queryClient.setQueryData([REACT_QUERY_KEYS.MESSAGES, conversationId], ctx.previousMessages)
		},

		onSuccess: (serverMessage, _content, ctx) => {
			if (!conversationId || !ctx) return

			queryClient.setQueryData<Message[]>([REACT_QUERY_KEYS.MESSAGES, conversationId], old => {
				const list = old ?? []

				// remove optimistic message

				const cleaned = list.filter(m => {
					const clientId = (m as any).clientId ?? (typeof m.id === 'string' && m.id.startsWith('temp:') ? m.id.slice(5) : null)

					return clientId !== ctx.clientId
				})

				// prevent duplicates

				if (cleaned.some(m => m.id === serverMessage.id)) {
					return cleaned
				}

				// append real server message
				return [...cleaned, serverMessage].sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt))
			})
		}
	})

	return {
		sendMessage: mutation.mutateAsync,
		isPending: mutation.isPending
	}
}

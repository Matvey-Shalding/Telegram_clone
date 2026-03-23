'use client'

import { authClient } from '@/auth-client'
import { Api } from '@/services/backend/clientApi'
import { SendMessageRequest } from '@/services/backend/messages'
import { MessageCacheService } from '@/services/client/message/messageCache'
import { MessagesOptimisticService } from '@/services/client/message/optimisticMessage'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export type SendMessagePayload = Omit<SendMessageRequest, 'conversationId'>

export function useSendMessage(conversationId: string | null, userId?: string) {
	const queryClient = useQueryClient()

	const user = authClient.useSession().data?.user

	const mutation = useMutation({
		mutationFn: async (payload: SendMessagePayload) => {
			if (!conversationId) throw new Error('No conversationId')

			const res = await Api.messages.send({
				conversationId,
				content: payload.content ?? '',
				imageUrl: payload.imageUrl ?? null
			})

			return res.message
		},

		onMutate: async payload => {
			if (!conversationId || !userId) return

			const previousMessages = MessageCacheService.getMessages(queryClient, conversationId)

			const { optimistic, clientId } = MessagesOptimisticService.createOptimisticMessage(
				conversationId,
				user,
				payload.content,
				payload.imageUrl
			)

			MessageCacheService.addMessage(queryClient, conversationId, optimistic)

			return { previousMessages, clientId }
		},

		onError: (_err, _payload, ctx) => {
			if (!conversationId || !ctx) return

			MessageCacheService.setMessages(queryClient, conversationId, ctx.previousMessages)
		},

		onSuccess: (serverMessage, _payload, ctx) => {
			if (!conversationId || !ctx) return

			MessagesOptimisticService.replaceOptimisticMessage(queryClient, conversationId, ctx.clientId, serverMessage)
		}
	})

	return {
		sendMessage: mutation.mutateAsync,
		isPending: mutation.isPending
	}
}

'use client'

import { ServerMessage } from '@/@types/Message'
import { Api } from '@/services/backend/clientApi'
import { MessageCacheService } from '@/services/client/message/messageCache'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useDeleteMessage() {
	const queryClient = useQueryClient()

	const { mutateAsync: deleteMessage } = useMutation({
		mutationFn: async (message: ServerMessage) => {
			await Api.messages.remove(message.id)
		},

		onMutate: async (message: ServerMessage) => {
			const previousMessages = MessageCacheService.getMessages(queryClient, message.conversationId)

			MessageCacheService.deleteMessage(queryClient, message.conversationId, message.id)

			return { previousMessages, conversationId: message.conversationId }
		},

		onError: (_err, _payload, ctx) => {
			if (!ctx) return

			MessageCacheService.setMessages(queryClient, ctx.conversationId, ctx.previousMessages)
		}
	})

	return deleteMessage
}

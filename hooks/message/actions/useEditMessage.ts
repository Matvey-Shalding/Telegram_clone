'use client'

import { Api } from '@/services/backend/clientApi'
import { MessageCacheService } from '@/services/client/message/messageCache'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useEditMessage(conversationId: string, messageId: string) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (content: string) => Api.messages.edit(messageId, content),

		onMutate: async content => {
			const previousMessages = MessageCacheService.getMessages(queryClient, conversationId)

			MessageCacheService.updateMessage(queryClient, conversationId, messageId, m => ({ ...m, content }))

			return { previousMessages }
		},

		onError: (_err, _payload, ctx) => {
			if (!ctx) return

			MessageCacheService.setMessages(queryClient, conversationId, ctx.previousMessages)
		}
	})
}

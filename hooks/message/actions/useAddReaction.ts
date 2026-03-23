'use client'

import { authClient } from '@/auth-client'
import { MessageReaction } from '@/generated/prisma/client'
import { Api } from '@/services/backend/clientApi'
import { MessagesOptimisticService } from '@/services/client/message/optimisticMessage'
import { currentConversationId } from '@/store'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import toast from 'react-hot-toast'

export function useAddReaction(messageId?: string) {
	const [conversationId] = useAtom(currentConversationId)
	const queryClient = useQueryClient()
	const user = authClient.useSession().data?.user

	const { mutateAsync: addReaction } = useMutation({
		mutationFn: async (emoji: string): Promise<MessageReaction> => {
			if (!messageId || !conversationId) throw new Error('Missing message or conversation ID')
			return Api.reactions.add(emoji, messageId, conversationId)
		},

		onMutate: emoji => {
			if (!messageId || !conversationId || !user?.id) throw new Error('Missing data for optimistic update')
			return MessagesOptimisticService.addReactionOptimistic(queryClient, conversationId, messageId, emoji, user)
		},

		onError: (_err, _emoji, ctx) => {
			if (!ctx || !conversationId) return
			MessagesOptimisticService.rollbackReaction(queryClient, conversationId, ctx.previousMessages)
			toast.error('Failed to add reaction')
		},

		onSuccess: (_data, _emoji, ctx) => {
			if (!ctx || !conversationId || !messageId) return
			MessagesOptimisticService.removeOptimisticReaction(queryClient, conversationId, messageId, ctx.clientId)
		}
	})

	return addReaction
}

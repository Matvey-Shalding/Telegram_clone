'use client'

import { authClient } from '@/auth-client'
import { Message } from '@/generated/prisma/browser'
import { generateId } from '@/lib/generateId'
import { Api } from '@/services/clientApi'
import { SendMessageRequest } from '@/services/messages'
import { currentConversationId as conversationAtom } from '@/store/conversationAtom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { useState } from 'react'

interface SendMessageContext {
	previousMessages: Message[] | undefined
}

interface UseSendMessageResult {
	messageInput: string
	setMessageInput: React.Dispatch<React.SetStateAction<string>>
	sendMessage: () => void
	isSending: boolean
	error: Error | null
}

export const useSendMessage = (): UseSendMessageResult => {
	const [messageInput, setMessageInput] = useState('')
	const [error, setError] = useState<Error | null>(null)

	const [currentConversationId] = useAtom(conversationAtom)
	const queryClient = useQueryClient()

	const session = authClient.useSession()
	const userId = session.data?.user.id

	const mutation = useMutation<
		Message, // ✅ server response
		Error, // ✅ error type
		SendMessageRequest, // ✅ variables
		SendMessageContext // ✅ context
	>({
		mutationFn: Api.messages.send,

		onMutate: async ({ content, conversationId }) => {
			setError(null)

			if (!userId) {
				throw new Error('User is not authenticated')
			}

			if (!conversationId) {
				throw new Error('Conversation ID is required')
			}

			await queryClient.cancelQueries({
				queryKey: ['messages', conversationId]
			})

			const previousMessages = queryClient.getQueryData<Message[]>(['messages', conversationId])

			const optimisticMessage: Message = {
				id: generateId(),
				content,
				conversationId,
				senderId: userId,
				createdAt: new Date(),
				updatedAt: new Date(),
				image: null,
				optimistic: true
			}

			queryClient.setQueryData<Message[]>(['messages', conversationId], (old = []) => [...old, optimisticMessage])

			setMessageInput('')

			return { previousMessages }
		},

		onError: (err, _vars, ctx) => {
			setError(err)

			if (!ctx?.previousMessages || !currentConversationId) return

			queryClient.setQueryData(['messages', currentConversationId], ctx.previousMessages)
		},

		onSuccess: (serverMessage, vars) => {
			/**
			 * Optional but type-safe improvement:
			 * Replace optimistic message instead of full refetch
			 */
			queryClient.setQueryData<Message[]>(['messages', vars.conversationId], old =>
				old?.map(msg => (msg.optimistic && msg.content === vars.content ? serverMessage : msg))
			)
		},

		onSettled: (_res, _err, vars) => {
			queryClient.invalidateQueries({
				queryKey: ['messages', vars.conversationId]
			})
		}
	})

	const sendMessage = () => {
		if (!currentConversationId) {
			setError(new Error('No active conversation'))
			return
		}

		if (!messageInput.trim()) return

		mutation.mutate({
			content: messageInput,
			conversationId: currentConversationId
		})
	}

	return {
		messageInput,
		setMessageInput,
		sendMessage,
		isSending: mutation.isPending,
		error
	}
}

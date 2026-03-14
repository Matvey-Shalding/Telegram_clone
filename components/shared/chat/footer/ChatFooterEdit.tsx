'use client'

import { ChatMode } from '@/@types/ChatMode'
import { ServerMessage } from '@/@types/Message'
import { InputGroupAddon, InputGroupInput } from '@/components/ui'
import { REACT_QUERY_KEYS } from '@/config/reactQueryKeys'
import { Api } from '@/services/backend/clientApi'
import { currentConversationId } from '@/store'
import { editedMessageId } from '@/store/editedMessageIdAtom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { Check } from 'lucide-react'
import React from 'react'
import toast from 'react-hot-toast'

interface Props {
	editedValue: string
	setEditedValue: React.Dispatch<React.SetStateAction<string>>
	setMode: React.Dispatch<React.SetStateAction<ChatMode>>
}

export const ChatFooterEdit: React.FC<Props> = ({ editedValue, setEditedValue, setMode }) => {
	const [messageId] = useAtom(editedMessageId)

	const [conversationId] = useAtom(currentConversationId)

	const queryClient = useQueryClient()

	const { mutateAsync: editMessage } = useMutation({
		mutationFn: async () => {
			if (!messageId) {
				throw new Error('No messageId provided')
			}
			await Api.messages.edit(messageId, editedValue ?? '')
		},
		onMutate: async () => {
			await queryClient.cancelQueries({
				queryKey: [REACT_QUERY_KEYS.MESSAGES, conversationId]
			})

			const previousMessages = queryClient.getQueryData<ServerMessage[]>([REACT_QUERY_KEYS.MESSAGES, conversationId]) ?? []

			queryClient.setQueryData<ServerMessage[]>([REACT_QUERY_KEYS.MESSAGES, conversationId], old => {
				const exists = old?.some(m => m.id === messageId)

				if (!exists) return old

				return old?.map(m =>
					m.id === messageId
						? {
								...m,
								content: editedValue
							}
						: m
				)
			})

			return { previousMessages, conversationId }
		},

		onError: (_err, _payload, ctx) => {
			toast.error('Failed to edit message')
			if (!ctx) return

			queryClient.setQueryData([REACT_QUERY_KEYS.MESSAGES, ctx.conversationId], ctx.previousMessages)
		}
	})

	const onSubmit = async () => {
		setEditedValue('')
		setMode('default')

		try {
			await editMessage()
		} catch (_error) {
			toast.error('Failed to edit message')
		}
	}

	return (
		<>
			<InputGroupInput
				value={editedValue}
				onChange={e => setEditedValue(e.target.value)}
				placeholder="Edit..."
				className="outline-none!"
			/>

			<InputGroupAddon align="inline-end">
				<div
					onClick={() => {
						onSubmit()
					}}
					className="size-7 cursor-pointer rounded-full grid place-content-center bg-[#212121]"
				>
					<Check className="text-muted-foreground size-5" />
				</div>
			</InputGroupAddon>
		</>
	)
}

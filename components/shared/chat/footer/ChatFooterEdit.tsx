'use client'

import { ChatMode } from '@/@types/ChatMode'
import { ServerMessage } from '@/@types/Message'
import { InputGroupAddon, InputGroupInput } from '@/components/ui'
import { Button } from '@/components/ui/button'
import { REACT_QUERY_KEYS } from '@/config/reactQueryKeys'
import { Api } from '@/services/backend/clientApi'
import { currentConversationId } from '@/store'
import { editedMessageId } from '@/store/editedMessageIdAtom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { Check, X } from 'lucide-react'
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

	const cancelEdit = () => {
		setEditedValue('')
		setMode('default')
	}

	const { mutateAsync: editMessage } = useMutation({
		mutationFn: async () => {
			if (!messageId) throw new Error('No messageId provided')
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
		} catch {
			toast.error('Failed to edit message')
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			onSubmit()
		}

		if (e.key === 'Escape') {
			e.preventDefault()
			cancelEdit()
		}
	}

	return (
		<>
			<InputGroupInput
				value={editedValue}
				onChange={e => setEditedValue(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder="Edit message..."
				className="outline-none!"
				autoFocus
			/>

			<InputGroupAddon
				align="inline-end"
				className="flex items-center gap-1"
			>
				<Button
					size="icon"
					variant="ghost"
					className="size-7"
					onClick={cancelEdit}
				>
					<X className="size-4" />
				</Button>

				<Button
					size="icon"
					className="size-7"
					onClick={onSubmit}
					disabled={!editedValue.trim()}
				>
					<Check className="size-4" />
				</Button>
			</InputGroupAddon>
		</>
	)
}

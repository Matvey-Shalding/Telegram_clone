'use client'

import type { ChatMode } from '@/@types/ChatMode'
import type { ServerMessage } from '@/@types/Message'
import { REACT_QUERY_KEYS } from '@/config/reactQueryKeys'
import { Api } from '@/services/clientApi'
import { editedMessageId } from '@/store/editedMessageIdAtom'
import { useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'

export function useMessageActions(message: ServerMessage, setEditedValue: (v: string) => void, setMode: (v: ChatMode) => void) {
	const [isOpen, setIsOpen] = useState(false)
	const [, setEditedMessageId] = useAtom(editedMessageId)
	const queryClient = useQueryClient()

	const handleEdit = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation()
			setIsOpen(false)
			setEditedMessageId(message.id)
			setEditedValue(message.content ?? '')
			setMode('edit')
		},
		[message, setEditedValue, setMode, setEditedMessageId]
	)

	const handleDelete = useCallback(
		async (e: React.MouseEvent) => {
			e.stopPropagation()
			setIsOpen(false)

			queryClient.setQueryData<ServerMessage[]>([REACT_QUERY_KEYS.MESSAGES, message.conversationId], old =>
				old?.filter(m => m.id !== message.id)
			)

			try {
				await Api.messages.remove(message.id)
			} catch {
				queryClient.invalidateQueries({
					queryKey: [REACT_QUERY_KEYS.MESSAGES, message.conversationId]
				})
				toast.error('Failed to delete message')
			}
		},
		[message, queryClient]
	)

	const handleCopy = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation()
			navigator.clipboard.writeText(message.content ?? '')
			toast.success('Copied to clipboard')
			setIsOpen(false)
		},
		[message.content]
	)

	return {
		isOpen,
		setIsOpen,
		handleEdit,
		handleDelete,
		handleCopy
	}
}

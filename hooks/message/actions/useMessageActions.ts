'use client'

import type { ChatMode } from '@/@types/ChatMode'
import type { ServerMessage } from '@/@types/Message'
import { editedMessageId } from '@/store/editedMessageIdAtom'
import { useAtom } from 'jotai'
import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { useDeleteMessage } from './useDeleteMessage'

export function useMessageActions(message: ServerMessage, setEditedValue: (v: string) => void, setMode: (v: ChatMode) => void) {
	const [isOpen, setIsOpen] = useState(false)
	const [, setEditedMessageId] = useAtom(editedMessageId)

	const deleteMessage = useDeleteMessage()

	// EDIT
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

	// DELETE
	const handleDelete = async (e: React.MouseEvent) => {
		e.stopPropagation()
		setIsOpen(false)

		try {
			await deleteMessage(message)
		} catch {
			toast.error('Failed to delete message')
		}
	}

	// COPY
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

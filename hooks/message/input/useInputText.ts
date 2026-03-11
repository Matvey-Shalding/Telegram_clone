import { useState } from 'react'
import toast from 'react-hot-toast'
import { SendMessagePayload } from '../actions/useSendMessage'

export const useInputText = (isPending: boolean, sendMessage: (payload: SendMessagePayload) => void) => {
	const [messageInput, setMessageInput] = useState('')

	const handleSendMessage = async () => {
		if (!messageInput.trim() || isPending) return

		try {
			const content = messageInput
			setMessageInput('')
			await sendMessage({ content, imageUrl: null })
		} catch (e) {
			toast.error('Something went wrong')
			console.error(e)
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSendMessage()
		}
	}

	return {
		messageInput,
		setMessageInput,
		handleSendMessage,
		handleKeyDown
	}
}

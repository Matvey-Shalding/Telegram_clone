'use client'

import { authClient } from '@/auth-client'
import { InputGroupAddon, InputGroupInput } from '@/components/ui'
import { useSendMessage } from '@/hooks/messages/useSendMessage'
import { Mic, Paperclip, Send, Smile } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

export const ChatFooterInput = ({ conversationId }: { conversationId: string }) => {
	const [messageInput, setMessageInput] = useState('')
	const userId = authClient.useSession()?.data?.user.id

	const { sendMessage, isPending } = useSendMessage(conversationId, userId)

	const handleSubmit = async () => {
		if (!messageInput.trim() || isPending) return

		try {
			setMessageInput('') // ✅ clear immediately
			await sendMessage(messageInput)
		} catch (e) {
			toast.error('Something went wrong')
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSubmit()
		}
	}

	return (
		<>
			<InputGroupInput
				value={messageInput}
				onChange={e => setMessageInput(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder="Write a message..."
				className="outline-none!"
				disabled={isPending}
			/>

			<InputGroupAddon className="p-0">
				<Paperclip className="text-muted-foreground size-5.5" />
			</InputGroupAddon>

			<InputGroupAddon
				className="flex items-center gap-x-3"
				align="inline-end"
			>
				{messageInput.length > 0 ? (
					<Send
						onClick={handleSubmit}
						className="text-muted-foreground size-5 cursor-pointer hover:text-foreground transition"
					/>
				) : (
					<>
						<Smile className="text-muted-foreground size-5.5" />
						<Mic className="text-muted-foreground size-5.5" />
					</>
				)}
			</InputGroupAddon>
		</>
	)
}

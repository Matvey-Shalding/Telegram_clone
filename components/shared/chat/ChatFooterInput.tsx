'use client'

import { InputGroupAddon, InputGroupInput } from '@/components/ui'
import { useSendMessage } from '@/hooks/messages/useSendMessage'
import { Mic, Paperclip, Send, Smile } from 'lucide-react'
import React from 'react'

export const ChatFooterInput: React.FC = () => {
	const { messageInput, setMessageInput, sendMessage, isSending } = useSendMessage()

	const handleSubmit = () => {
		if (!messageInput.trim() || isSending) return
		sendMessage()
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
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
			/>

			<InputGroupAddon>
				<Paperclip className="text-muted-foreground size-6 -translate-x-1" />
			</InputGroupAddon>

			<InputGroupAddon
				className="flex items-center gap-x-3"
				align="inline-end"
			>
				{messageInput.length > 0 ? (
					<Send
						onClick={handleSubmit}
						className="text-muted-foreground size-6 cursor-pointer"
					/>
				) : (
					<>
						<Smile className="text-muted-foreground size-6" />
						<Mic className="text-muted-foreground size-6" />
					</>
				)}
			</InputGroupAddon>
		</>
	)
}

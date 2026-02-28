import { InputGroupAddon, InputGroupInput } from '@/components/ui'
import { Mic, Paperclip, Send, Smile } from 'lucide-react'
import React from 'react'
import { UploadImageModal } from './UploadImageModal'
interface Props {
	className?: string
	messageInput: string
	setMessageInput: React.Dispatch<React.SetStateAction<string>>
	handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
	handleSendMessage: () => void
	isPending: boolean
	isOpen: boolean
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
	selectedFile: File | null
	handleFileSelect: (files: File[] | null) => void
}
export const SendMessageInput: React.FC<Props> = ({
	messageInput,
	setMessageInput,
	handleKeyDown,
	handleSendMessage,
	isPending,
	isOpen,
	setIsOpen,
	selectedFile,
	handleFileSelect
}) => {
	return (
		<>
			<InputGroupInput
				value={messageInput}
				onChange={e => setMessageInput(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder="Write a message..."
				className="outline-none! pl-0!"
				disabled={isPending}
			/>

			<InputGroupAddon className="p-0">
				<Paperclip
					onClick={() => setIsOpen(true)}
					className="text-muted-foreground size-5.5 cursor-pointer"
				/>

				<UploadImageModal
					selectedFile={selectedFile}
					isOpen={isOpen}
					onOpenChange={setIsOpen}
					onFilesSelected={handleFileSelect}
				/>
			</InputGroupAddon>

			<InputGroupAddon
				align="inline-end"
				className="flex items-center gap-x-3"
			>
				{messageInput.length > 0 ? (
					<Send
						onClick={handleSendMessage}
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

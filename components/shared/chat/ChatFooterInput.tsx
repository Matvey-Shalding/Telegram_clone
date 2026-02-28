'use client'

import { authClient } from '@/auth-client'
import { useSendMessage } from '@/hooks/messages/useSendMessage'
import { useChatInput } from '@/hooks/useChatInputController'
import { SendImageInput } from './SendImageInput'
import { SendMessageInput } from './SendMessageInput'

export const ChatFooterInput = ({ conversationId }: { conversationId: string }) => {
	const session = authClient.useSession()
	const userId = session?.data?.user?.id

	const { sendMessage, isPending } = useSendMessage(conversationId, userId)

	const {
		messageInput,
		setMessageInput,
		handleSendMessage,
		handleKeyDown,
		isOpen,
		setIsOpen,
		selectedFile,
		previewUrl,
		handleFileSelect,
		handleRemoveFile,
		handleUploadFile,
		isBusy
	} = useChatInput({ isPending, sendMessage })

	return (
		<div className="relative flex items-center gap-x-2 w-full">
			{selectedFile && previewUrl ? (
				<SendImageInput
					previewUrl={previewUrl}
					selectedFile={selectedFile}
					isUploading={isBusy}
					handleRemoveFile={handleRemoveFile}
					handleSendFile={handleUploadFile}
				/>
			) : (
				<SendMessageInput
					messageInput={messageInput}
					setMessageInput={setMessageInput}
					isOpen={isOpen}
					setIsOpen={setIsOpen}
					handleFileSelect={handleFileSelect}
					handleKeyDown={handleKeyDown}
					handleSendMessage={handleSendMessage}
					selectedFile={selectedFile}
					isPending={isBusy}
				/>
			)}
		</div>
	)
}

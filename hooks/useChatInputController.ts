'use client'

import { useChatInputImage } from './messages/useChatInputImage'
import { useChatInputMessage } from './messages/useChatInputMessage'
import { SendMessagePayload } from './messages/useSendMessage'

type UseChatInputArgs = {
	isPending: boolean
	sendMessage: (payload: SendMessagePayload) => void
}

export const useChatInput = ({ isPending, sendMessage }: UseChatInputArgs) => {
	const message = useChatInputMessage(isPending, sendMessage)
	const image = useChatInputImage(isPending, sendMessage)

	const isBusy = isPending || image.isUploading

	return {
		// message API
		messageInput: message.messageInput,
		setMessageInput: message.setMessageInput,
		handleSendMessage: message.handleSendMessage,
		handleKeyDown: message.handleKeyDown,

		// image API
		isOpen: image.isOpen,
		setIsOpen: image.setIsOpen,
		selectedFile: image.selectedFile,
		previewUrl: image.previewUrl,
		handleFileSelect: image.handleFileSelect,
		handleRemoveFile: image.handleRemoveFile,
		handleUploadFile: image.handleUploadFile,

		// loading flag
		isBusy
	}
}

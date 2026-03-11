'use client'

import { SendMessagePayload } from '../message/actions/useSendMessage'
import { useInputImage } from '../message/input/useInputImage'
import { useInputText } from '../message/input/useInputText'

type UseChatInputArgs = {
	isPending: boolean
	sendMessage: (payload: SendMessagePayload) => void
}

export const useChatInput = ({ isPending, sendMessage }: UseChatInputArgs) => {
	const message = useInputText(isPending, sendMessage)
	const image = useInputImage(isPending, sendMessage)

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

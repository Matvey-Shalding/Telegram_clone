import { useImageUpload } from '@/hooks/useImageUpload'
import { uploadToCloudinary } from '@/lib'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { SendMessagePayload } from '../actions/useSendMessage'

export const useInputImage = (isPending: boolean, sendMessage: (payload: SendMessagePayload) => void) => {
	const image = useImageUpload()

	const [isUploading, setIsUploading] = useState(false)

	const handleUploadFile = async () => {
		if (!image.file || isUploading || isPending) return

		setIsUploading(true)

		try {
			const imageUrl = await uploadToCloudinary(image.file)

			await sendMessage({
				imageUrl,
				content: ''
			})

			image.removeFile()
		} catch (e) {
			toast.error('Failed to upload image')
			console.error(e)
		} finally {
			setIsUploading(false)
		}
	}

	return {
		// modal state
		isOpen: image.isOpen,
		setIsOpen: image.setIsOpen,

		// file state
		selectedFile: image.file,
		previewUrl: image.previewUrl,

		// actions
		handleFileSelect: image.handleFileSelect,
		handleRemoveFile: image.removeFile,
		handleUploadFile,

		// status
		isUploading
	}
}

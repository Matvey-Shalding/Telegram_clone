
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { SendMessagePayload } from '../actions/useSendMessage'
import { uploadToCloudinary } from '@/lib'

export const useInputImage = (isPending: boolean, sendMessage: (payload: SendMessagePayload) => void) => {
	const [isOpen, setIsOpen] = useState(false)
	const [selectedFile, setSelectedFile] = useState<File | null>(null)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)
	const [isUploading, setIsUploading] = useState(false)

	const handleFileSelect = (files: File[] | null) => {
		if (!files?.[0]) return

		const file = files[0]
		setSelectedFile(file)
		setPreviewUrl(URL.createObjectURL(file))
		setIsOpen(false)
	}

	useEffect(() => {
		return () => {
			if (previewUrl) URL.revokeObjectURL(previewUrl)
		}
	}, [previewUrl])

	const handleRemoveFile = () => {
		if (isUploading) return
		if (previewUrl) URL.revokeObjectURL(previewUrl)
		setSelectedFile(null)
		setPreviewUrl(null)
	}

	const handleUploadFile = async () => {
		if (!selectedFile || isUploading || isPending) return

		setIsUploading(true)

		try {
			const imageUrl = await uploadToCloudinary(selectedFile)
			await sendMessage({ imageUrl: imageUrl, content: '' })
			handleRemoveFile()
		} catch (e) {
			toast.error('Failed to upload image')
			console.error(e)
		} finally {
			setIsUploading(false)
		}
	}

	return {
		isOpen,
		setIsOpen,
		selectedFile,
		handleFileSelect,
		previewUrl,
		handleRemoveFile,
		isUploading,
		handleUploadFile
	}
}

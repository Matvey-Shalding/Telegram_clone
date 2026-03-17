import { useEffect, useState } from 'react'

export const useImageUpload = () => {
	const [isOpen, setIsOpen] = useState(false)
	const [file, setFile] = useState<File | null>(null)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)

	const handleFileSelect = (files: File[] | null) => {
		const selected = files?.[0] ?? null

		if (!selected) {
			setFile(null)
			setPreviewUrl(null)
			return
		}

		const url = URL.createObjectURL(selected)

		setFile(selected)
		setPreviewUrl(url)
		setIsOpen(false)
	}

	useEffect(() => {
		return () => {
			if (previewUrl) URL.revokeObjectURL(previewUrl)
		}
	}, [previewUrl])

	const removeFile = () => {
		if (previewUrl) URL.revokeObjectURL(previewUrl)

		setFile(null)
		setPreviewUrl(null)
	}

	return {
		isOpen,
		setIsOpen,
		file,
		previewUrl,
		handleFileSelect,
		removeFile
	}
}

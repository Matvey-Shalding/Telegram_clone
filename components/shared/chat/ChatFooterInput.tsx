'use client'

import { authClient } from '@/auth-client'
import { InputGroupAddon, InputGroupInput } from '@/components/ui'
import { useSendMessage } from '@/hooks/messages/useSendMessage'
import { uploadToCloudinary } from '@/lib/server/uploadToCloudinary'
import { cn } from '@/lib/utils'
import { Mic, Paperclip, Send, Smile, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { UploadImageModal } from './UploadImageModal'

export const ChatFooterInput = ({ conversationId }: { conversationId: string }) => {
	const [messageInput, setMessageInput] = useState('')
	const [open, setOpen] = useState(false)

	const [selectedFile, setSelectedFile] = useState<File | null>(null)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)
	const [isUploading, setIsUploading] = useState(false)

	const userId = authClient.useSession()?.data?.user.id
	const { sendMessage, isPending } = useSendMessage(conversationId, userId)

	const handleSubmit = async () => {
		if (!messageInput.trim() || isPending) return

		try {
			const content = messageInput
			setMessageInput('')
			await sendMessage({ content })
		} catch (e) {
			toast.error('Something went wrong')
			console.error(e)
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSubmit()
		}
	}

	const handleFilesSelected = (files: File[] | null) => {
		if (!files?.[0]) return

		const file = files[0]
		setSelectedFile(file)
		setPreviewUrl(URL.createObjectURL(file))
		setOpen(false)
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

	const handleSendSelectedFile = async () => {
		if (!selectedFile || isUploading) return

		setIsUploading(true)

		try {
			const imageUrl = await uploadToCloudinary(selectedFile)
			await sendMessage({ image: imageUrl })
			handleRemoveFile()
		} catch (e) {
			toast.error('Failed to upload image')
			console.error(e)
		} finally {
			setIsUploading(false)
		}
	}

	return (
		<div className="relative flex items-center gap-x-2 w-full">
			{selectedFile && previewUrl ? (
				<div className="relative flex items-center w-full px-2 py-1">
					{/* image preview */}
					<div className="relative flex-shrink-0">
						<img
							src={previewUrl}
							alt={selectedFile.name}
							className={cn('size-10 rounded-md object-cover transition-opacity', isUploading && 'opacity-60')}
						/>

						{/* uploading spinner */}
						{isUploading && (
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
							</div>
						)}

						{/* remove */}
						<button
							type="button"
							onClick={handleRemoveFile}
							disabled={isUploading}
							className={cn(
								'absolute -top-1 -right-1 p-0.5 rounded-full text-gray-400 bg-gray-300 transition',
								isUploading && 'opacity-40 pointer-events-none'
							)}
						>
							<X className="h-3 w-3" />
						</button>
					</div>

					<div className="flex-1" />

					{/* send */}
					<button
						type="button"
						onClick={handleSendSelectedFile}
						disabled={isUploading}
						className={cn(
							'absolute right-2 top-1/2 -translate-y-1/2 transition',
							isUploading ? 'opacity-40 pointer-events-none' : 'hover:scale-105'
						)}
					>
						<Send className="h-5 w-5 text-muted-foreground" />
					</button>
				</div>
			) : (
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
							onClick={() => setOpen(true)}
							className="text-muted-foreground size-5.5 cursor-pointer"
						/>

						<UploadImageModal
							selectedFile={selectedFile}
							open={open}
							onOpenChange={setOpen}
							onFilesSelected={handleFilesSelected}
						/>
					</InputGroupAddon>

					<InputGroupAddon
						align="inline-end"
						className="flex items-center gap-x-3"
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
			)}
		</div>
	)
}

import { cn } from '@/lib/utils'
import { Send, X } from 'lucide-react'
import React from 'react'
interface Props {
	className?: string
	previewUrl: string
	selectedFile: File
	isUploading: boolean
	handleRemoveFile: () => void
	handleSendFile: () => void
}
export const SendImageInput: React.FC<Props> = ({ className, previewUrl, selectedFile, isUploading, handleRemoveFile, handleSendFile }) => {
	return (
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
				onClick={handleSendFile}
				disabled={isUploading}
				className={cn(
					'absolute right-2 top-1/2 -translate-y-1/2 transition',
					isUploading ? 'opacity-40 pointer-events-none' : 'hover:scale-105'
				)}
			>
				<Send className="h-5 w-5 text-muted-foreground" />
			</button>
		</div>
	)
}

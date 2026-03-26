'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

type UploadImageModalProps = {
	isOpen: boolean
	onOpenChange: (open: boolean) => void
	onFilesSelected: (files: File[] | null) => void
	file: File | null
	previewUrl?: string | null
}

export function UploadImageModal({ isOpen, onOpenChange, onFilesSelected, file, previewUrl }: UploadImageModalProps) {
	const onDrop = useCallback(
		(files: File[]) => {
			const selected = files[0]
			if (!selected) return
			onFilesSelected([selected])
		},
		[onFilesSelected]
	)

	const { getRootProps, getInputProps, open } = useDropzone({
		multiple: false,
		maxFiles: 1,
		noClick: true,
		onDrop,
		accept: {
			'image/jpeg': [],
			'image/png': [],
			'image/avif': []
		},
		maxSize: 10 * 1024 * 1024
	})

	return (
		<Dialog
			open={isOpen}
			onOpenChange={onOpenChange}
		>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Upload image</DialogTitle>
				</DialogHeader>

				<div
					{...getRootProps()}
					className="
						flex flex-col items-center justify-center gap-4
						rounded-lg border-2 border-dashed
						p-8 text-center
						transition hover:border-primary
					"
				>
					<input {...getInputProps()} />

					{previewUrl ? (
						<img
							src={previewUrl}
							className="h-24 w-24 rounded-md object-cover"
						/>
					) : (
						<p className="text-sm text-muted-foreground">Drag & drop an image here</p>
					)}

					{file && (
						<div className="text-xs text-muted-foreground">
							{file.name} — {(file.size / 1024).toFixed(1)} KB
						</div>
					)}

					<div className="flex gap-x-2">
						<Button
							type="button"
							variant="secondary"
							onClick={e => {
								e.stopPropagation()
								open()
							}}
						>
							{file ? 'Replace image' : 'Select file'}
						</Button>

						{file && (
							<Button
								type="button"
								variant="secondary"
								onClick={() => onFilesSelected(null)}
							>
								Delete
							</Button>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}

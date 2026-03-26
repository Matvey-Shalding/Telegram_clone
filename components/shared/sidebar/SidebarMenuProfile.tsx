'use client'

import { Input } from '@/components/ui'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { UploadImageModal } from '@/components/ui/UploadImageModal'
import { useProfile } from '@/hooks/useProfile'
import { motion } from 'framer-motion'
import { Upload } from 'lucide-react'
import React from 'react'
import { Controller } from 'react-hook-form'
import { Avatar } from '../Avatar'

interface Props {
	defaultName?: string
	defaultEmail?: string
	defaultAvatar?: string
}

export const SidebarMenuProfile: React.FC<Props> = ({ defaultName, defaultEmail}) => {
	const {
		form,
		loading,
		isDialogOpen,
		setIsDialogOpen,
		avatarSrc,
		isOpen,
		setIsOpen,
		file,
		previewUrl,
		handleFileSelect,
		handleCancel,
		onSubmit
	} = useProfile(defaultName, defaultEmail)

	return (
		<>
			<Dialog
				open={isDialogOpen}
				onOpenChange={setIsDialogOpen}
			>
				<DialogTrigger>
					<motion.button
						whileHover={{ scale: 1.03, x: 2 }}
						whileTap={{ scale: 0.97 }}
						className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-accent/10 transition-all duration-150 font-medium text-sm w-full"
					>
						<Upload size={18} />
						Profile
					</motion.button>
				</DialogTrigger>

				<DialogContent className="sm:max-w-md">
					<DialogHeader className="pb-2.5 border-b border-border">
						<DialogTitle>Edit profile</DialogTitle>
						<DialogDescription>Update your name, email and avatar.</DialogDescription>
					</DialogHeader>

					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-5"
					>
						<div className="flex flex-col items-center gap-3">
							<Avatar
								src={avatarSrc}
								className="size-20"
								noBadge
							/>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => setIsOpen(true)}
								disabled={loading}
							>
								<Upload className="size-4 mr-2" /> Change avatar
							</Button>
						</div>

						<FieldGroup>
							<Controller
								name="name"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel>Name</FieldLabel>
										<Input
											{...field}
											placeholder="Your name"
										/>
										{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
									</Field>
								)}
							/>
							<Controller
								name="email"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel>Email</FieldLabel>
										<Input
											{...field}
											type="email"
											placeholder="you@example.com"
										/>
										{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
									</Field>
								)}
							/>
						</FieldGroup>

						<div className="flex justify-end gap-2 pt-2">
							<Button
								type="button"
								variant="outline"
								onClick={handleCancel}
								disabled={loading}
							>
								{loading && (
									<Spinner
										data-icon="inline-start"
										className="mr-2"
									/>
								)}{' '}
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={loading}
							>
								{loading && (
									<Spinner
										data-icon="inline-start"
										className="mr-2"
									/>
								)}{' '}
								Save changes
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>

			<UploadImageModal
				isOpen={isOpen}
				onOpenChange={setIsOpen}
				file={file}
				previewUrl={previewUrl}
				onFilesSelected={handleFileSelect}
			/>
		</>
	)
}

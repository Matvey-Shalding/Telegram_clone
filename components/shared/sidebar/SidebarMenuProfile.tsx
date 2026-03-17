'use client'

import { Upload, User as UserIcon } from 'lucide-react'
import React from 'react'
import { Controller } from 'react-hook-form'

import { Button, Input } from '@/components/ui'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'
import { Avatar } from '../Avatar'
import { MenuItem } from './SidebarMenu'

import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { UploadImageModal } from '@/components/ui/UploadImageModal'
import { useProfile } from '@/hooks/useProfile'

interface Props {
	defaultName?: string
	defaultEmail?: string
	defaultAvatar?: string
}

export const SidebarMenuProfile: React.FC<Props> = ({ defaultName, defaultEmail, defaultAvatar }) => {
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
		removeFile,
		onSubmit
	} = useProfile(defaultName, defaultEmail)
	return (
		<>
			<Dialog
				open={isDialogOpen}
				onOpenChange={setIsDialogOpen}
			>
				<DialogTrigger>
					<MenuItem
						icon={<UserIcon size={18} />}
						label="Profile"
					/>
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
						{/* Avatar */}
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
								<Upload className="size-4 mr-2" />
								Change avatar
							</Button>
						</div>

						<FieldGroup>
							{/* Name */}
							<Controller
								name="name"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel>Name</FieldLabel>
										<Input
											{...field}
											placeholder="Your name"
											aria-invalid={fieldState.invalid}
										/>
										{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
									</Field>
								)}
							/>

							{/* Email */}
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
											aria-invalid={fieldState.invalid}
										/>
										{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
									</Field>
								)}
							/>
						</FieldGroup>

						{/* Actions */}
						<div className="flex justify-end gap-2 pt-2">
							<Button
								type="button"
								variant="outline"
								onClick={handleCancel}
								disabled={loading}
							>
								{loading ? (
									<>
										<Spinner
											data-icon="inline-start"
											className="mr-2"
										/>{' '}
										Cancel
									</>
								) : (
									'Cancel'
								)}
							</Button>
							<Button
								type="submit"
								disabled={loading}
							>
								{loading ? (
									<>
										<Spinner
											data-icon="inline-start"
											className="mr-2"
										/>{' '}
										Saving...
									</>
								) : (
									'Save changes'
								)}
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

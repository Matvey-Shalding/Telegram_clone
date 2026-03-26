'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { authClient } from '@/auth-client'
import { ProfileSchema, ProfileSchemaType } from '@/config/ProfileSchema'
import { useImageUpload } from '@/hooks/useImageUpload'
import { uploadToCloudinary } from '@/lib'
import { Api } from '@/services/backend/clientApi'

export function useProfile(defaultName?: string, defaultEmail?: string) {
	const user = authClient.useSession()?.data?.user

	const form = useForm<ProfileSchemaType>({
		resolver: zodResolver(ProfileSchema),
		defaultValues: {
			name: user?.name ?? defaultName ?? '',
			email: user?.email ?? defaultEmail ?? ''
		}
	})

	const [loading, setLoading] = useState(false)
	const [isDialogOpen, setIsDialogOpen] = useState(false)

	const { isOpen, setIsOpen, file, previewUrl, handleFileSelect, removeFile } = useImageUpload()

	const avatarSrc = previewUrl ?? user?.image ?? undefined

	const handleCancel = () => {
		form.reset({
			name: user?.name ?? defaultName ?? '',
			email: user?.email ?? defaultEmail ?? ''
		})
		removeFile()
		setIsDialogOpen(false)
	}

	const onSubmit = async (data: ProfileSchemaType) => {
		try {
			setLoading(true)

			let avatarUrl: string | undefined = user?.image ?? undefined
			if (file) {
				try {
					avatarUrl = await uploadToCloudinary(file)
				} catch (err: unknown) {
					console.error('Upload failed', err)
					toast.error('Failed to upload avatar')
					return
				}
			}

			await Api.users.edit(data.name, data.email, avatarUrl)

			form.reset({
				name: data.name,
				email: data.email
			})
			removeFile()
			toast.success('Profile updated')
			setIsDialogOpen(false)
		} catch (err: unknown) {
			// Safe narrowing for unknown error
			if (err && typeof err === 'object' && 'response' in err && typeof (err as any).response === 'object') {
				const response = (
					err as {
						response?: { status?: number; data?: { error?: string } }
					}
				).response

				const status = response?.status
				const message = response?.data?.error ?? 'Failed to update profile'

				if (status === 409) {
					form.setError('email', { type: 'manual', message })
					toast.error(message)
				} else {
					console.error(err)
					toast.error(message)
				}
			} else if (err instanceof Error) {
				toast.error(err.message)
			} else {
				toast.error('An unknown error occurred')
			}
		} finally {
			setLoading(false)
		}
	}

	// Reset form to current user values when dialog opens
	useEffect(() => {
		if (isDialogOpen) {
			form.reset({
				name: user?.name ?? defaultName ?? '',
				email: user?.email ?? defaultEmail ?? ''
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isDialogOpen, user])

	return {
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
		removeFile,
		handleCancel,
		onSubmit
	}
}

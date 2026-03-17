'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'

import { ProfileSchema, ProfileSchemaType } from '@/config/ProfileSchema'
import { authClient } from '@/auth-client'
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
				} catch (err) {
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
		} catch (err: any) {
			const status = err?.response?.status
			const message = err?.response?.data?.error ?? err?.message

			if (status === 409) {
				form.setError('email', { type: 'manual', message: message ?? 'Email already in use' })
				toast.error(message ?? 'Email already in use')
			} else {
				console.error(err)
				toast.error('Failed to update profile')
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
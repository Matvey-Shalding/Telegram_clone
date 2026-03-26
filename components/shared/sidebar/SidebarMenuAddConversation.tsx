'use client'

import { Field, FieldError, FieldLabel, Input } from '@/components/ui'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { REACT_QUERY_KEYS } from '@/config'
import { User } from '@/generated/prisma/client'
import { Api } from '@/services/backend/clientApi'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import React from 'react'
import toast from 'react-hot-toast'
import { SidebarCombobox } from './SidebarCombobox'

interface Props {
	className?: string
}

export const SidebarMenuAddConversation: React.FC<Props> = () => {
	const { data: users } = useQuery<User[]>({
		queryKey: [REACT_QUERY_KEYS.USERS],
		queryFn: () => Api.users.getAll()
	})

	const [selectedUsers, setSelectedUsers] = React.useState<User[]>([])
	const [groupName, setGroupName] = React.useState('')
	const [isOpen, setIsOpen] = React.useState(false)
	const [isLoading, setIsLoading] = React.useState(false)
	const [nameError, setNameError] = React.useState('')
	const [comboboxError, setComboboxError] = React.useState('')

	const handleCancel = () => {
		setIsOpen(false)
		setGroupName('')
		setSelectedUsers([])
		setNameError('')
		setComboboxError('')
	}

	const handleSubmit = async () => {
		if (!groupName.trim()) {
			setNameError('Name is required')
			return
		}
		setNameError('')

		if (selectedUsers.length < 2) {
			setComboboxError('Select at least 2 users')
			return
		}
		setComboboxError('')

		try {
			setIsLoading(true)
			await Api.conversation.createGroup(groupName, selectedUsers)
			handleCancel()
			toast.success('Group created!')
		} catch (err: unknown) {
			// Safe narrowing for completely unknown error
			if (err && typeof err === 'object' && 'response' in err && typeof err.response === 'object') {
				const response = (
					err as {
						response?: { status?: number; data?: { message?: string } }
					}
				).response

				if (response?.status === 409) {
					toast.error(response.data?.message || 'This group already exists')
				} else {
					toast.error('Failed to create group')
				}
			} else if (err instanceof Error) {
				toast.error(err.message)
			} else {
				toast.error('An unknown error occurred')
			}
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Dialog
			open={isOpen}
			onOpenChange={setIsOpen}
		>
			<DialogTrigger>
				<motion.button
					whileHover={{ scale: 1.03, x: 2 }}
					whileTap={{ scale: 0.97 }}
					className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-accent/10 transition-all duration-150 font-medium text-sm w-full"
				>
					<Plus size={18} />
					New conversation
				</motion.button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-md flex flex-col gap-y-4">
				<DialogHeader className="pb-2 border-b border-border">
					<DialogTitle>Create a group chat</DialogTitle>
					<DialogDescription>Create a chat with more than 2 people</DialogDescription>
				</DialogHeader>

				<Field>
					<FieldLabel>Name</FieldLabel>
					<Input
						value={groupName}
						onChange={e => setGroupName(e.target.value)}
						placeholder="My group"
						className="transition-colors focus:ring-2 focus:ring-primary/50"
					/>
					<FieldError>{nameError}</FieldError>
				</Field>

				<div className="flex flex-col gap-y-2">
					<SidebarCombobox
						data={users || []}
						selectedUsersIds={selectedUsers}
						setSelectedUsersIds={setSelectedUsers}
					/>
					<FieldError>{comboboxError}</FieldError>
				</div>

				<Separator className="my-0" />

				<motion.div
					initial={{ opacity: 0, y: 5 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.2 }}
					className="flex mobile:justify-end gap-2"
				>
					<Button
						className="max-mobile:basis-1/2"
						variant="outline"
						size="lg"
						onClick={handleCancel}
						disabled={isLoading}
					>
						{isLoading && (
							<Spinner
								className="mr-2"
								data-icon="inline-start"
							/>
						)}
						Cancel
					</Button>
					<Button
						className="max-mobile:basis-1/2"
						size="lg"
						onClick={handleSubmit}
						disabled={isLoading}
					>
						{isLoading && (
							<Spinner
								className="mr-2"
								data-icon="inline-start"
							/>
						)}
						Create
					</Button>
				</motion.div>
			</DialogContent>
		</Dialog>
	)
}

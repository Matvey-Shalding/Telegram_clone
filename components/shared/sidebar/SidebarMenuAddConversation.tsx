import { Button, Field, FieldError, FieldLabel, Input, Separator } from '@/components/ui'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'
import { REACT_QUERY_KEYS } from '@/config'
import { User } from '@/generated/prisma/client'
import { Api } from '@/services/backend/clientApi'
import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import React from 'react'
import toast from 'react-hot-toast'
import { SidebarCombobox } from './SidebarCombobox'
import { MenuItem } from './SidebarMenu'
interface Props {
	className?: string
}
export const SidebarMenuAddConversation: React.FC<Props> = ({ className }) => {
	const { data: users } = useQuery({
		queryKey: [REACT_QUERY_KEYS.USERS],
		queryFn: () => Api.users.getAll()
	})

	const [selectedUsersIds, setSelectedUsersIds] = React.useState<User[]>([])

	const [isOpen, setIsOpen] = React.useState(false)

	const [groupName, setGroupName] = React.useState('')

	const [nameError, setNameError] = React.useState('')

	const [comboboxError, setComboboxError] = React.useState('')

	const [isLoading, setIsLoading] = React.useState(false)

	const handleCancel = () => {
		setIsOpen(false)
		setGroupName('')
		setSelectedUsersIds([])
		setNameError('')
		setComboboxError('')
	}

	const handleSubmit = async () => {
		if (groupName.trim().length === 0) {
			setNameError('Name is required')
			return
		}

		setNameError('')

		if (selectedUsersIds.length < 2) {
			setComboboxError('Select at least 2 users')
			return
		}

		setComboboxError('')

		try {
			setIsLoading(true)

			await Api.conversation.createGroup(groupName, selectedUsersIds)

			handleCancel()
		} catch (err: any) {
			if (err.response?.status === 409) {
				// Group already exists
				toast.error(err.response.data.message ?? 'This group already exists')
				return null
			}
			toast.error('Failed to create group')
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
				<MenuItem
					icon={<Plus size={18} />}
					label="New conversation"
				/>
			</DialogTrigger>
			<DialogContent>
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
					/>
					<FieldError>{nameError}</FieldError>
				</Field>
				<div className="flex flex-col gap-y-2">
					<SidebarCombobox
						selectedUsersIds={selectedUsersIds}
						setSelectedUsersIds={setSelectedUsersIds}
						data={users || []}
					/>
					<FieldError>{comboboxError}</FieldError>
				</div>
				<Separator />
				<div className="flex items-center justify-end gap-x-2">
					<Button
						onClick={handleCancel}
						disabled={isLoading}
						size="lg"
						variant="secondary"
					>
						Cancel
						{isLoading && <Spinner data-icon="inline-start" />}
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={isLoading}
						size="lg"
					>
						Create
						{isLoading && <Spinner data-icon="inline-start" />}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}

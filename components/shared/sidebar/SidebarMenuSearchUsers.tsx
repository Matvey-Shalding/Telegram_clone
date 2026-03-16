'use client'

import { Field, FieldLabel, InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { REACT_QUERY_KEYS } from '@/config'
import { Api } from '@/services/backend/clientApi'
import { useQuery } from '@tanstack/react-query'
import { Search, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import toast from 'react-hot-toast'
import { useDebounce } from 'react-use'
import { Avatar } from '../Avatar'
import { MenuItem } from './SidebarMenu'

interface Props {
	className?: string
}

const UserSearchSkeleton = () => {
	return (
		<div className="flex items-center gap-3 px-3 py-2">
			<Skeleton className="size-8 rounded-full shrink-0" />

			<div className="flex flex-col gap-1 flex-1">
				<Skeleton className="h-3 w-24" />
				<Skeleton className="h-3 w-32" />
			</div>
		</div>
	)
}

export const SidebarMenuSearchUsers: React.FC<Props> = ({ className }) => {
	const router = useRouter()

	const [isOpen, setIsOpen] = React.useState(false)

	const [searchValue, setSearchValue] = React.useState('')
	const [debouncedValue, setDebouncedValue] = React.useState('')

	const [creatingUserId, setCreatingUserId] = React.useState<string | null>(null)

	useDebounce(
		() => {
			setDebouncedValue(searchValue)
		},
		250,
		[searchValue]
	)

	const { data: users, isFetching } = useQuery({
		queryKey: [REACT_QUERY_KEYS.SEARCH_USERS, debouncedValue],
		queryFn: () => Api.users.search(debouncedValue),
		enabled: debouncedValue.length >= 2
	})

	const handleUserClick = async (userId: string) => {
		try {
			setCreatingUserId(userId)

			const conversation = await Api.conversation.createDirect(userId)

			setIsOpen(false)

			router.push(`/chat/${conversation.id}`)
		} catch (error) {
			toast.error('Failed to start conversation')
		} finally {
			setCreatingUserId(null)
		}
	}

	return (
		<Dialog
			open={isOpen}
			onOpenChange={setIsOpen}
		>
			<DialogTrigger>
				<MenuItem
					icon={<Search size={18} />}
					label="Search users"
				/>
			</DialogTrigger>

			<DialogContent className="flex flex-col h-100 max-h-100 sm:max-w-md">
				<DialogHeader className="pb-3 border-b border-border">
					<DialogTitle>Start a conversation</DialogTitle>
					<DialogDescription>Search and select people to chat with.</DialogDescription>
				</DialogHeader>

				<Field>
					<FieldLabel>Search</FieldLabel>

					<InputGroup>
						<InputGroupInput
							autoFocus
							value={searchValue}
							onChange={e => setSearchValue(e.target.value)}
							placeholder="Search users..."
						/>

						<InputGroupAddon>
							<Search className="size-4 text-muted-foreground" />
						</InputGroupAddon>

						{searchValue && (
							<InputGroupAddon
								onClick={() => setSearchValue('')}
								align="inline-end"
							>
								<X className="size-4 text-muted-foreground" />
							</InputGroupAddon>
						)}
					</InputGroup>
				</Field>

				<div className="flex flex-col overflow-y-auto max-h-[300px]">
					{/* idle */}
					{debouncedValue.length < 2 && <p className="text-sm text-muted-foreground text-center py-6">Start typing to search users</p>}

					{/* loading */}
					{isFetching && (
						<div className="flex flex-col">
							{Array.from({ length: 5 }).map((_, i) => (
								<UserSearchSkeleton key={i} />
							))}
						</div>
					)}

					{/* empty */}
					{!isFetching && users?.length === 0 && debouncedValue.length >= 2 && (
						<p className="text-sm text-muted-foreground text-center py-6">No users found</p>
					)}

					{/* results */}
					{!isFetching &&
						users?.map(user => (
							<button
								key={user.id}
								onClick={() => handleUserClick(user.id)}
								disabled={creatingUserId !== null}
								className="flex items-center w-full px-3 py-2 rounded-lg hover:bg-accent transition-colors disabled:opacity-60"
							>
								<Avatar
									noBadge
									className="size-8 shrink-0"
								/>

								<div className="ml-2 flex flex-col text-left truncate flex-1">
									<span className="font-medium text-sm truncate">{user.name}</span>

									<span className="text-xs text-muted-foreground truncate">{user.email}</span>
								</div>

								{creatingUserId === user.id && <span className="text-xs text-muted-foreground">Creating...</span>}
							</button>
						))}
				</div>
			</DialogContent>
		</Dialog>
	)
}

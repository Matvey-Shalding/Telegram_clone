'use client'

import { SidebarMenuButton, SidebarMenuItem, Skeleton } from '@/components/ui'
import { Conversation } from '@/db/schema'
import { formatDate } from '@/lib/formatDate'
import { Api } from '@/services/clientApi'
import { useQuery } from '@tanstack/react-query'
import { AvatarWithBadge } from '..'
import { useRouter } from 'next/navigation'

export const SidebarChatItem: React.FC<Conversation> = ({ title, id }) => {
	const unreadCount = 0 // temporary static value

	const { data: lastMessage, isLoading } = useQuery({
		queryKey: ['lastMessage', { id }],
		queryFn: () => Api.conversation.getLastMessage(id)
	})

	const router = useRouter()

	const handleClick = () => {
		router.push(`/chat/${id}`)
	}


	if (isLoading && lastMessage === undefined) {
		return (
			<SidebarMenuItem onClick={handleClick}>
				<SidebarMenuButton className="flex items-center rounded-none min-h-14 min-w-full">
					{/* Real avatar */}
					<div className="flex h-8 w-8 items-center justify-center shrink-0">
						<AvatarWithBadge />
					</div>

					<div
						data-sidebar="label"
						className="flex min-w-0 flex-1 flex-col gap-1"
					>
						{/* Top row: real title + skeleton time */}
						<div className="flex min-w-0 items-center justify-between">
							<span className="truncate text-sm font-medium">{title}</span>

							{/* Time skeleton */}
							<Skeleton className="h-3 w-10 rounded" />
						</div>

						{/* Bottom row: message preview + unread badge */}
						<div className="flex min-w-0 items-center justify-between">
							{/* Message preview skeleton */}
							<Skeleton className="h-3 w-32 rounded" />

							{/* Unread badge skeleton */}
							<Skeleton className="h-5 w-5 rounded-full" />
						</div>
					</div>
				</SidebarMenuButton>
			</SidebarMenuItem>
		)
	}

	return (
		<SidebarMenuItem onClick={handleClick}>
			<SidebarMenuButton
				tooltip={title ?? 'Untitled Chat'}
				className="
				flex items-center rounded-none min-h-14 min-w-full"
			>
				<div className="flex h-8 w-8 items-center justify-center shrink-0">
					<AvatarWithBadge />
				</div>

				<div
					data-sidebar="label"
					className="flex min-w-0 flex-1 flex-col gap-1"
				>
					<div className="flex min-w-0 items-center justify-between">
						<span className="truncate text-sm font-medium">{title}</span>
						<span className="shrink-0 text-xs text-muted-foreground">{formatDate(String(lastMessage!.createdAt))}</span>
					</div>

					<div className="flex min-w-0 items-center justify-between">
						<span className="truncate text-xs text-muted-foreground">{lastMessage!.content}</span>

						{unreadCount > 0 && (
							<div className="grid size-5 shrink-0 place-content-center rounded-full bg-muted text-xs">{unreadCount}</div>
						)}
					</div>
				</div>
			</SidebarMenuButton>
		</SidebarMenuItem>
	)
}

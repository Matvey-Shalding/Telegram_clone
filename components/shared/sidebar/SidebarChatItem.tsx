'use client'

import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui'
import { AvatarWithBadge } from '..'


interface ChatListItemProps {
	title: string
	preview?: string
	time?: string
	unreadCount?: number
}

export const SidebarChatItem: React.FC<ChatListItemProps> = ({
	title,
	preview = 'Last message preview goes here',
	time = '2:30 PM',
	unreadCount = 0
}) => {
	return (
		<SidebarMenuItem>
			<SidebarMenuButton
				tooltip={title}
				className="flex items-center rounded-none min-h-14 min-w-full"
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
						<span className="shrink-0 text-xs text-muted-foreground">{time}</span>
					</div>

					<div className="flex min-w-0 items-center justify-between">
						<span className="truncate text-xs text-muted-foreground">{preview}</span>

						{unreadCount > 0 && (
							<div className="grid size-5 shrink-0 place-content-center rounded-full bg-muted text-xs">{unreadCount}</div>
						)}
					</div>
				</div>
			</SidebarMenuButton>
		</SidebarMenuItem>
	)
}

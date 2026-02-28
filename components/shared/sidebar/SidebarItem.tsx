'use client'

import { Chat } from '@/@types/Chat'
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui'
import { useCurrentSession } from '@/hooks/useCurrentSession'
import { formatConversationDate, getConversationDescription, getConversationTitle } from '@/lib/conversation.helpers'
import { useRouter } from 'next/navigation'
import { AvatarWithBadge } from '..'
export const SidebarItem: React.FC<Chat> = conversation => {
	const unreadCount = 0 // temporary static value

	const session = useCurrentSession()

	const currentUserId = useCurrentSession()?.user.id

	const currentUserName = useCurrentSession()?.user.name

	const formattedTitle = getConversationTitle(conversation, conversation.members, currentUserId)

	const description = getConversationDescription(conversation, currentUserId)

	const router = useRouter()

	const handleClick = () => {
		router.push(`/chat/${conversation.id}`)
	}

	return (
		<SidebarMenuItem onClick={handleClick}>
			<SidebarMenuButton
				tooltip={formattedTitle}
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
						<span className="truncate text-sm font-medium">{formattedTitle}</span>
						<span className="shrink-0 text-xs text-muted-foreground">{formatConversationDate(conversation.lastMessageAt)}</span>
					</div>

					<div className="flex min-w-0 items-center justify-between">
						<span className="truncate text-xs text-muted-foreground">{description}</span>

						{unreadCount > 0 && (
							<div className="grid size-5 shrink-0 place-content-center rounded-full bg-muted text-xs">{unreadCount}</div>
						)}
					</div>
				</div>
			</SidebarMenuButton>
		</SidebarMenuItem>
	)
}

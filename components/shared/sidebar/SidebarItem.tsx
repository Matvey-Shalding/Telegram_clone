'use client'

import { Chat } from '@/@types/Chat'
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui'
import { useCurrentSession } from '@/hooks/useCurrentSession'
import { formatConversationDate, getConversationDescription, getConversationTitle } from '@/lib/conversation.helpers'
import { activeUsers } from '@/store/activeUsersAtom'
import { useAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { AvatarWithBadge } from '..'
export const SidebarItem: React.FC<Chat> = conversation => {
	const unreadCount = 0 // temporary static value

	const currentUserId = useCurrentSession()?.user.id

	const formattedTitle = getConversationTitle(conversation, conversation.members, currentUserId)

	const description = getConversationDescription(conversation, currentUserId)

	const router = useRouter()

	const handleClick = () => {
		router.push(`/chat/${conversation.id}`)
	}

	const [activeIds] = useAtom(activeUsers)

	const isOnline = useMemo(() => {
		if (conversation.isGroup) {
			return false
		}

		const otherMember = conversation.members.find(m => m.userId !== currentUserId)

		if (!otherMember) {
			return false
		}

		return activeIds.includes(otherMember.userId)
	}, [activeIds, currentUserId, conversation])

	return (
		<SidebarMenuItem onClick={handleClick}>
			<SidebarMenuButton
				tooltip={formattedTitle}
				className="
				flex items-center rounded-none min-h-14 min-w-full"
			>
				<AvatarWithBadge
					noBadge={!isOnline}
					className="min-w-8 min-h-8"
				/>
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

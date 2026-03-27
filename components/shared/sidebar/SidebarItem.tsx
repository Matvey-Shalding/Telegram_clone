'use client'

import { ConversationWithMembers } from '@/@types/Conversation'
import { authClient } from '@/auth-client'
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui'
import { REACT_QUERY_KEYS } from '@/config'
import { useCurrentSession } from '@/hooks/useCurrentSession'
import { formatConversationDate, getConversationLastMessage, getConversationTitle } from '@/lib/conversation.helpers'
import { Api } from '@/services/backend/clientApi'
import { activeUsers } from '@/store/activeUsersAtom'
import { useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { Avatar } from '..'

export const SidebarItem: React.FC<ConversationWithMembers> = conversation => {
	const currentUserId = useCurrentSession()?.user.id
	const formattedTitle = getConversationTitle(conversation, conversation.members, currentUserId)
	const description = getConversationLastMessage(conversation, currentUserId)
	const router = useRouter()

	const session = authClient.useSession()

	const handleClick = () => {
		router.push(`/chat/${conversation.id}`)
	}

	const { data } = useQuery({
		queryKey: [REACT_QUERY_KEYS.UNREAD_COUNT, conversation.id, session],
		queryFn: () => Api.conversation.getUnreadCount(conversation.id)
	})

	const unreadCount = data?.count

	const [activeIds] = useAtom(activeUsers)

	const isOnline = useMemo(() => {
		if (conversation.isGroup) return false
		const otherMember = conversation.members.find(m => m.userId !== currentUserId)
		return !!otherMember && activeIds.includes(otherMember.userId)
	}, [activeIds, currentUserId, conversation])

	const groupMembers = conversation.isGroup ? conversation.members.map(m => ({ src: m.user.image, name: m.user.name })) : []

	const singleAvatarSrc = !conversation.isGroup ? conversation.members.find(m => m.userId !== currentUserId)?.user.image : undefined

	return (
		<SidebarMenuItem
			className="transition-all"
			onClick={handleClick}
		>
			<SidebarMenuButton
				tooltip={formattedTitle}
				className="flex items-center rounded-none min-h-14 min-w-full"
			>
				<Avatar
					src={singleAvatarSrc}
					groupSrc={groupMembers}
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
						<span className="truncate text-xs text-muted-foreground">
							{description || 'No messages yet. Start the conversation by sending a message.'}
						</span>

						{Number(unreadCount) > 0 && (
							<div className="grid size-5 shrink-0 place-content-center rounded-full bg-muted text-xs">{unreadCount}</div>
						)}
					</div>
				</div>
			</SidebarMenuButton>
		</SidebarMenuItem>
	)
}

'use client'

import { ConversationWithMembers } from '@/@types/Conversation'
import { authClient } from '@/auth-client'
import { SidebarContent as Sidebar, SidebarGroup, SidebarMenu } from '@/components/ui/sidebar'
import { REACT_QUERY_KEYS } from '@/config/reactQueryKeys'
import { getConversationTitle } from '@/lib/conversation.helpers'
import { Api } from '@/services/backend/clientApi'
import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { useMemo } from 'react'
import { SidebarItem } from '.'
import { SidebarItemSkeleton } from './SidebarItemSkeleton'

interface Props {
	searchValue: string
}

export const SidebarContent: React.FC<Props> = ({ searchValue }) => {
	const { data = [], isLoading } = useQuery<ConversationWithMembers[]>({
		queryKey: [REACT_QUERY_KEYS.CHATS],
		queryFn: () => Api.conversation.getAll()
	})

	

	const userId = authClient.useSession().data?.user.id

	const chats = useMemo(() => {
		const q = searchValue.toLowerCase()

		return data
			.map(chat => ({
				...chat,
				lastMessageAt: chat.lastMessageAt ? new Date(chat.lastMessageAt) : null
			}))
			.filter(chat => {
				const title = getConversationTitle(chat, chat.members, userId)
				return title.toLowerCase().includes(q)
			})
			.sort((a, b) => {
				const aTime = a.lastMessageAt?.getTime()
				const bTime = b.lastMessageAt?.getTime()

				if (!aTime && !bTime) return 0
				if (!aTime) return 1
				if (!bTime) return -1

				return bTime - aTime
			})
	}, [searchValue, data, userId])

	return (
		<Sidebar>
			<SidebarGroup className="px-0">
				<SidebarMenu>
					{isLoading && Array.from({ length: 12 }).map((_, i) => <SidebarItemSkeleton key={i} />)}

					{!isLoading && (
						<AnimatePresence mode="popLayout">
							{chats.map(chat => (
								<motion.div
									key={chat.id}
									layout
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: 'auto' }}
									exit={{ opacity: 0, height: 0 }}
									transition={{ duration: 0.22, ease: 'easeInOut' }}
								>
									<SidebarItem {...chat} />
								</motion.div>
							))}
						</AnimatePresence>
					)}
				</SidebarMenu>
			</SidebarGroup>
		</Sidebar>
	)
}

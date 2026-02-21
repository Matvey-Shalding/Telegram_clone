'use client'

import { Chat } from '@/@types/Chat'
import { authClient } from '@/auth-client'
import { SidebarContent as Sidebar, SidebarGroup, SidebarMenu } from '@/components/ui/sidebar'
import { Conversation } from '@/lib'
import { Api } from '@/services/clientApi'
import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { useMemo } from 'react'
import { SidebarItem } from '.'
import { SidebarItemSkeleton } from './SidebarItemSkeleton'

interface Props {
	className?: string
	searchValue: string
}

export const SidebarContent: React.FC<Props> = ({ className, searchValue }) => {
	const { data = [], isLoading } = useQuery<Chat[]>({
		queryKey: ['chats'],
		queryFn: () => Api.conversation.getAll()
	})

	const userId = authClient.useSession().data?.user.id

	const chats = useMemo(() => {
		const q = searchValue.toLowerCase()

		return data.filter(chat => {
			const conversationService = new Conversation(chat)

			const title = conversationService.getTitle(chat.members, userId)
			return title.toLowerCase().includes(q)
		})
	}, [searchValue, data])

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

'use client'

import { ConversationMemberWithUser } from '@/@types/ConversationMemberWithUser'
import { REACT_QUERY_KEYS } from '@/config'
import { Api } from '@/services/backend/clientApi'
import { currentConversationId } from '@/store'
import { useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { Avatar } from '../../Avatar'

export const ChatHeaderDrawerMembers = () => {
	const [conversationId] = useAtom(currentConversationId)

	const { data: members } = useQuery<ConversationMemberWithUser[]>({
		queryKey: [REACT_QUERY_KEYS.CONVERSATION_MEMBERS, conversationId],
		queryFn: () => Api.conversation.getMembers(conversationId),
		enabled: !!conversationId
	})

	return (
		<div className="flex flex-col overflow-y-auto py-2 px-2">
			{members?.map(member => (
				<button
					key={member.id}
					className="flex items-center w-full px-2 py-1 rounded-lg"
				>
					<Avatar
						noBadge
						className="size-8"
					/>

					<div className="ml-2 flex-1 flex flex-col text-left truncate">
						<span className="font-medium text-sm truncate">{member.user.name}</span>
						<span className="text-xs text-muted-foreground truncate">{member.user.email}</span>
					</div>
				</button>
			))}
		</div>
	)
}

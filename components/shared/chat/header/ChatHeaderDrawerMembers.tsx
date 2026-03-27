'use client'

import { ConversationMemberWithUser } from '@/@types/ConversationMemberWithUser'
import { authClient } from '@/auth-client'
import { UserItem } from '@/components/ui/UserItem'
import { Skeleton } from '@/components/ui/skeleton'
import { REACT_QUERY_KEYS } from '@/config'
import { Api } from '@/services/backend/clientApi'
import { currentConversationId } from '@/store'
import { useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'

export const ChatHeaderDrawerMembers = () => {
	const [conversationId] = useAtom(currentConversationId)

	const session = authClient.useSession()

	const { data: members, isLoading } = useQuery<ConversationMemberWithUser[]>({
		queryKey: [REACT_QUERY_KEYS.CONVERSATION_MEMBERS, conversationId,session],
		queryFn: () => Api.conversation.getMembers(conversationId),
		enabled: !!conversationId
	})

	console.log(members, 'members')

	if (isLoading)
		return (
			<div className="flex flex-col gap-2 overflow-y-auto p-2">
				{Array.from({ length: 5 }).map((_, i) => (
					<div
						key={i}
						className="flex items-center gap-2"
					>
						<Skeleton className="w-8 h-8 rounded-full" />
						<div className="flex flex-col gap-1 flex-1">
							<Skeleton className="h-3 w-24" />
							<Skeleton className="h-3 w-32" />
						</div>
					</div>
				))}
			</div>
		)

	return (
		<div className="flex flex-col gap-2 overflow-y-auto p-2">
			{members?.map(member => (
				<UserItem
					name={member.user.name}
					email={member.user.email}
					avatar={member.user.image}
					key={member.id}
				/>
			))}
		</div>
	)
}

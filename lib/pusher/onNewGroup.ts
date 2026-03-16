import { ConversationWithMembers } from '@/@types/Conversation'
import { authClient } from '@/auth-client'
import { GroupInviteToast } from '@/components/shared/chat/header/GroupInviteToast'
import { REACT_QUERY_KEYS } from '@/config'
import { QueryClient } from '@tanstack/react-query'

interface Payload {
	conversation: ConversationWithMembers
	creatorId: string
}

export const onNewGroup = (queryClient: QueryClient) => async (payload: Payload) => {
	const { conversation, creatorId } = payload

	queryClient.setQueryData<ConversationWithMembers[]>([REACT_QUERY_KEYS.CHATS], old => [...(old ?? []), conversation])

	const currentUserId = (await authClient.getSession())?.data?.user.id

	if (creatorId !== currentUserId && conversation.title) {
		GroupInviteToast({ title: conversation.title })
	}
}

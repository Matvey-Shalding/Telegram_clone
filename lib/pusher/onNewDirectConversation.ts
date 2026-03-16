import { ConversationWithMembers } from '@/@types/Conversation'
import { authClient } from '@/auth-client'
import { DirectConversationToast } from '@/components/shared/sidebar/DirectConversationToast'
import { REACT_QUERY_KEYS } from '@/config/reactQueryKeys'
import { QueryClient } from '@tanstack/react-query'

interface Payload {
	conversation: ConversationWithMembers
	isCreator?: boolean
	senderName?: string
}

export const onNewDirectConversation = (queryClient: QueryClient) => async (payload: Payload) => {
	const { conversation, isCreator, senderName } = payload

	const currentUserId = (await authClient.getSession())?.data?.user.id

	// update sidebar conversations

	queryClient.setQueryData<ConversationWithMembers[]>([REACT_QUERY_KEYS.CHATS], old => [...(old ?? []), conversation])

	// notify the user that conversation has been created

	if (!isCreator && senderName) {
		DirectConversationToast({ senderName })
	}
}

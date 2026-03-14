import { ConversationWithMembers } from '@/@types/Conversation'
import { ConversationMemberWithUser } from '@/@types/ConversationMemberWithUser'
import { REACT_QUERY_KEYS } from '@/config'
import { QueryClient } from '@tanstack/react-query'

interface Payload {
	newMembers: ConversationMemberWithUser[]
	conversationId: string
	isSameUser?: boolean
}

export const onLeaveConversation = (queryClient: QueryClient) => async (payload: Payload) => {
	console.log(payload, 'payload data')

	const { conversationId, newMembers, isSameUser } = payload

	// Update conversation drawer cache

	queryClient.setQueryData<ConversationMemberWithUser[]>([REACT_QUERY_KEYS.CONVERSATION_MEMBERS, conversationId], newMembers)

	queryClient.setQueryData<ConversationWithMembers>([REACT_QUERY_KEYS.CONVERSATION, conversationId], old => {
		if (!old) return old

		return {
			...old,
			members: newMembers
		}
	})

	// Update sidebar cache to remove leaved chat

	if (isSameUser) {
		queryClient.setQueryData<ConversationWithMembers[]>([REACT_QUERY_KEYS.CHATS], old => old?.filter(c => c.id !== conversationId))
	}
}

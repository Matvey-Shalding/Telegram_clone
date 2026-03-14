import { ConversationWithMembers } from '@/@types/Conversation'
import { REACT_QUERY_KEYS } from '@/config'
import { QueryClient } from '@tanstack/react-query'
import { redirect } from 'next/navigation'

export const onDeleteConversation = (queryClient: QueryClient) => async (payload: { conversationId: string }) => {
	const { conversationId } = payload

	if (!conversationId) {
		return
	}

	queryClient.setQueryData<ConversationWithMembers[]>([REACT_QUERY_KEYS.CHATS], old => old?.filter(c => c.id !== conversationId))

	redirect('/')
}

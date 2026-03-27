import { authClient } from '@/auth-client'
import { REACT_QUERY_KEYS } from '@/config/reactQueryKeys'
import { Api } from '@/services/backend/clientApi'
import { currentConversationId } from '@/store'
import { useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { useEffect } from 'react'

export const useLastReadAt = () => {
	const [conversationId] = useAtom(currentConversationId)

	const session = authClient.useSession()

	useEffect(() => {
		console.log('SESSION', session)
	}, [session])

	const { data } = useQuery<Date | null>({
		queryKey: [REACT_QUERY_KEYS.LAST_READ_AT, conversationId, session],
		queryFn: async () => {
			const res = await Api.conversation.getLastReadAt(conversationId!)

			return res.lastReadAt
		}
	})

	return data
}

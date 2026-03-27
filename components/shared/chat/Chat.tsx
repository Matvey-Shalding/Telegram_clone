'use client'

import { authClient } from '@/auth-client'
import { REACT_QUERY_KEYS } from '@/config'
import { useChatController } from '@/hooks/chat/useChatController'
import { Api } from '@/services/backend/clientApi'
import { currentConversationId } from '@/store'
import { useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { ChatContent } from './ChatContent'
import { ChatFooter } from './footer/ChatFooter'
import { ChatHeader } from './header/ChatHeader'

interface Props {
	conversationId: string
}

export const Chat: React.FC<Props> = ({ conversationId }) => {
	const session = authClient.useSession()

	const { data: conversation } = useQuery({
		queryKey: [REACT_QUERY_KEYS.CONVERSATION, conversationId, session],
		queryFn: async () => await Api.conversation.get(conversationId)
	})

	const [, setConversationId] = useAtom(currentConversationId)

	useEffect(() => {
		setConversationId(conversationId)
	}, [conversationId, setConversationId])

	const { mode, setMode, searchValue, setSearchValue, editedValue, setEditedValue, title, details } = useChatController(conversation!)

	return (
		<div className="h-screen w-full flex flex-col">
			<ChatHeader
				isGroup={conversation?.isGroup}
				setSearchValue={setSearchValue}
				setMode={setMode}
				mode={mode}
				title={title}
				details={details}
			/>

			<ChatContent
				setMode={setMode}
				setEditedValue={setEditedValue}
				mode={mode}
				searchValue={searchValue}
			/>

			<ChatFooter
				setMode={setMode}
				editedValue={editedValue}
				setEditedValue={setEditedValue}
				mode={mode}
				searchValue={searchValue}
				setSearchValue={setSearchValue}
			/>
		</div>
	)
}

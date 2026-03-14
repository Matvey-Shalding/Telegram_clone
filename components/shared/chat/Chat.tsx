'use client'

import { REACT_QUERY_KEYS } from '@/config'
import { useChatController } from '@/hooks/chat/useChatController'
import { Api } from '@/services/backend/clientApi'
import { currentConversationId } from '@/store'
import { activeUsers } from '@/store/activeUsersAtom'
import { useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { ChatContent } from './ChatContent'
import { ChatFooter } from './ChatFooter'
import { ChatHeader } from './ChatHeader'

interface Props {
	conversationId: string
}

export const Chat: React.FC<Props> = ({ conversationId }) => {
	const { data: conversation } = useQuery({
		queryKey: [REACT_QUERY_KEYS.CONVERSATION, conversationId],
		queryFn: async () => await Api.conversation.get(conversationId)
	})

	const [, setConversationId] = useAtom(currentConversationId)

	useEffect(() => {
		setConversationId(conversationId)
	}, [conversationId])

	const { mode, setMode, searchValue, setSearchValue, editedValue, setEditedValue, title, details } = useChatController(conversation!)

	const [activeMembers] = useAtom(activeUsers)

	return (
		<div className="h-screen w-full flex flex-col">
			<ChatHeader
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

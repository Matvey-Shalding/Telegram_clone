'use client'

import { Chat as Conversation } from '@/@types/Chat'
import { ChatMode } from '@/@types/ChatMode'
import { authClient } from '@/auth-client'
import { getConversationDetails, getConversationTitle } from '@/lib/conversation.helpers'
import { activeUsers } from '@/store/activeUsersAtom'
import { currentConversationId } from '@/store/conversationAtom'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'

export function useChatController(conversation: Conversation | null) {
	const [mode, setMode] = useState<ChatMode>('default')
	const [searchValue, setSearchValue] = useState('')
	const [editedValue, setEditedValue] = useState('')

	const userId = authClient.useSession().data?.user.id

	const title = getConversationTitle(conversation, conversation?.members ?? null, userId)

	const [users] = useAtom(activeUsers)

	const details = getConversationDetails(conversation, conversation?.members ?? null, users, userId)

	const [, setCurrentConversationId] = useAtom(currentConversationId)

	// Sync current conversation ID to Jotai
	useEffect(() => {
		if (conversation?.id) {
			setCurrentConversationId(conversation.id)
		}
	}, [conversation?.id, setCurrentConversationId])

	return {
		mode,
		setMode,
		searchValue,
		setSearchValue,
		editedValue,
		setEditedValue,
		title,
		details
	}
}

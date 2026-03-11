'use client'

import { ChatMode } from '@/@types/ChatMode'
import { ConversationWithMembers } from '@/@types/Conversation'
import { authClient } from '@/auth-client'
import { getConversationStatus, getConversationTitle } from '@/lib/conversation.helpers'
import { activeUsers } from '@/store/activeUsersAtom'
import { currentConversationId } from '@/store/conversationAtom'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'

export function useChatController(conversation: ConversationWithMembers | null) {
	const [mode, setMode] = useState<ChatMode>('default')
	const [searchValue, setSearchValue] = useState('')
	const [editedValue, setEditedValue] = useState('')

	const userId = authClient.useSession().data?.user.id

	const title = getConversationTitle(conversation, conversation?.members ?? null, userId)

	const [users] = useAtom(activeUsers)

	const details = getConversationStatus(conversation, conversation?.members ?? null, users, userId)

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

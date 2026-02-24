'use client'

import { Chat as Conversation } from '@/@types/Chat'
import { ChatMode } from '@/@types/ChatMode'
import { currentConversationId } from '@/store/conversationAtom'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { ChatContent } from './ChatContent'
import { ChatFooter } from './ChatFooter'
import { ChatHeader } from './ChatHeader'

interface Props {
	title: string
	details: string
	conversation: Conversation | null
}

export const Chat: React.FC<Props> = ({ title, details, conversation }) => {
	const [mode, setMode] = useState<ChatMode>('default')

	const [searchValue, setSearchValue] = useState('')

	const [editedValue, setEditedValue] = useState('')

	const [, setCurrentConversationId] = useAtom(currentConversationId)

	/**
	 *  Set the conversation ID in Jotai
	 */
	useEffect(() => {
		if (conversation?.id) {
			setCurrentConversationId(conversation.id)
		}
	}, [conversation?.id, setCurrentConversationId])

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

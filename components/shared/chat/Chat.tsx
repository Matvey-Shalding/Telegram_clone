'use client'

import { Chat as Conversation } from '@/@types/Chat'
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
	const [mode, setMode] = useState<'default' | 'search'>('default')
	const [searchValue, setSearchValue] = useState('')

	const [, setCurrentConversationId] = useAtom(currentConversationId)

	/**
	 * 1️⃣ Set the conversation ID in Jotai
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
				mode={mode}
				searchValue={searchValue}
			/>

			<ChatFooter
				mode={mode}
				searchValue={searchValue}
				setSearchValue={setSearchValue}
			/>
		</div>
	)
}

'use client'

import { ChatMode } from '@/@types/ChatMode'
import { InputGroup } from '@/components/ui'
import { cn } from '@/lib/utils'
import { currentConversationId } from '@/store'
import { useAtom } from 'jotai'
import React from 'react'
import { ChatFooterEdit } from './ChatFooterEdit'
import { ChatFooterInput } from './ChatFooterInput'
import { ChatFooterSearch } from './ChatFooterSearch'

interface Props {
	mode: ChatMode
	searchValue: string
	setSearchValue: React.Dispatch<React.SetStateAction<string>>
	editedValue: string
	setEditedValue: React.Dispatch<React.SetStateAction<string>>
	setMode: React.Dispatch<React.SetStateAction<ChatMode>>
}

export const ChatFooter: React.FC<Props> = ({ mode, searchValue, setSearchValue, editedValue, setEditedValue, setMode }) => {
	const [conversationId] = useAtom(currentConversationId)
	if (!conversationId) return null

	const renderContent = () => {
		switch (mode) {
			case 'search':
				return (
					<ChatFooterSearch
						searchValue={searchValue}
						setSearchValue={setSearchValue}
					/>
				)

			case 'edit':
				return (
					<ChatFooterEdit
						setMode={setMode}
						editedValue={editedValue}
						setEditedValue={setEditedValue}
					/>
				)

			case 'default':
			default:
				return <ChatFooterInput conversationId={conversationId} />
		}
	}

	return (
		<div className="border-t sticky bottom-0 left-0 shrink-0 h-12 w-full">
			<InputGroup className={cn('w-full h-full', 'bg-[#171717]', 'p-2.5 pl-4', 'rounded-none text-lg font-medium')}>
				{renderContent()}
			</InputGroup>
		</div>
	)
}

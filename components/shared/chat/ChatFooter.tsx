'use client'

import { ChatMode } from '@/@types/ChatMode'
import { InputGroup } from '@/components/ui'
import { cn } from '@/lib/utils'
import { currentConversationId } from '@/store'
import { useAtom } from 'jotai'
import React from 'react'
import { ChatFooterInput } from './ChatFooterInput'
import { ChatFooterSearch } from './ChatFooterSearch'

interface Props {
	mode: ChatMode
	searchValue: string
	setSearchValue: React.Dispatch<React.SetStateAction<string>>
}

export const ChatFooter: React.FC<Props> = ({ mode, searchValue, setSearchValue }) => {
	const [conversationId] = useAtom(currentConversationId) //conversationId

	if (!conversationId) {
		return null
	}

	return (
		<div className="border-t sticky bottom-0 left-0 shrink-0 h-12 w-full">
			<InputGroup className={cn('w-full h-full', 'bg-[#171717]', 'p-2.5 pl-4', 'rounded-none text-lg font-medium', 'outline-none!')}>
				{mode === 'search' ? (
					<ChatFooterSearch
						searchValue={searchValue}
						setSearchValue={setSearchValue}
					/>
				) : (
					<ChatFooterInput conversationId={conversationId} />
				)}
			</InputGroup>
		</div>
	)
}

'use client'

import { ChatMode } from '@/@types/ChatMode'
import { InputGroup } from '@/components/ui'
import { cn } from '@/lib/utils'
import React from 'react'
import { ChatFooterInput } from './ChatFooterInput'
import { ChatFooterSearch } from './ChatFooterSearch'

interface Props {
	mode: ChatMode
	searchValue: string
	setSearchValue: React.Dispatch<React.SetStateAction<string>>
}

export const ChatFooter: React.FC<Props> = ({ mode, searchValue, setSearchValue }) => {
	return (
		<InputGroup
			className={cn(
				'sticky bottom-0 left-0 shrink-0 h-12 w-full',
				'border-t border-border',
				'bg-[#171717]',
				'p-2.5 pl-5',
				'rounded-none text-lg font-medium',
				'outline-none!'
			)}
		>
			{mode === 'search' ? (
				<ChatFooterSearch
					searchValue={searchValue}
					setSearchValue={setSearchValue}
				/>
			) : (
				<ChatFooterInput />
			)}
		</InputGroup>
	)
}

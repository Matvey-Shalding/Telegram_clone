'use client'

import { ChatMode } from '@/@types/ChatMode'
import { InputGroup } from '@/components/ui'
import { cn } from '@/lib/utils'
import { currentConversationId } from '@/store'
import { AnimatePresence, motion } from 'framer-motion'
import { useAtom } from 'jotai'
import React, { useMemo } from 'react'
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

	const content = useMemo(() => {
		const map = {
			search: (
				<ChatFooterSearch
					searchValue={searchValue}
					setSearchValue={setSearchValue}
				/>
			),
			edit: (
				<ChatFooterEdit
					editedValue={editedValue}
					setEditedValue={setEditedValue}
					setMode={setMode}
				/>
			),
			default: <ChatFooterInput conversationId={conversationId!} />
		} as const

		return map[mode] ?? map.default
	}, [mode, searchValue, setSearchValue, editedValue, setEditedValue, setMode, conversationId])

	return (
		<div className="border-t border-border sticky bottom-0 left-0 shrink-0 h-12 w-full">
			<InputGroup className={cn('w-full h-full', 'bg-sidebar', 'p-2.5 pl-4', 'rounded-none text-lg font-medium border-none outline-none')}>
				<AnimatePresence
					mode="wait"
					initial={false}
				>
					<motion.div
						key={mode}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.2, ease: 'easeInOut' }}
						className="w-full flex items-center"
					>
						{content}
					</motion.div>
				</AnimatePresence>
			</InputGroup>
		</div>
	)
}

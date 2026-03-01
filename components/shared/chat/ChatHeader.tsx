'use client'

import { ChatMode } from '@/@types/ChatMode'
import { activeUsers } from '@/store/activeUsersAtom'
import { AnimatePresence, motion } from 'framer-motion'
import { useAtom } from 'jotai'
import { Search, X } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'

interface Props {
	details: string
	title: string
	setMode: Dispatch<SetStateAction<ChatMode>>
	mode: ChatMode
	setSearchValue: Dispatch<SetStateAction<string>>
}

export const ChatHeader: React.FC<Props> = ({ details, title, mode, setMode, setSearchValue }) => {
	const handleClick = () => {
		if (mode === 'search') setSearchValue('')
		setMode(prev => (prev === 'default' ? 'search' : 'default'))
	}


	return (
		<div className="border-b border-border bg-[#171717] px-4 h-15.25 shrink-0 w-full flex items-center justify-between">
			<div className="flex flex-col">
				<span className="text-white font-medium">{title}</span>
				<span className="text-xs text-sidebar-ring">{details}</span>
			</div>

			<div
				className="p-2 cursor-pointer relative"
				onClick={handleClick}
			>
				<AnimatePresence mode="wait">
					{mode === 'default' ? (
						<motion.div
							key="search"
							initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
							animate={{ rotate: 0, opacity: 1, scale: 1 }}
							exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
							transition={{ duration: 0.2 }}
						>
							<Search className="text-sidebar-ring size-5.5" />
						</motion.div>
					) : (
						<motion.div
							key="close"
							initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
							animate={{ rotate: 0, opacity: 1, scale: 1 }}
							exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
							transition={{ duration: 0.2 }}
						>
							<X className="text-sidebar-ring size-5.5" />
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	)
}

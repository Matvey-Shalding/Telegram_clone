'use client'

import { ChatMode } from '@/@types/ChatMode'
import { AnimatePresence, motion } from 'framer-motion'
import { EllipsisVertical, Search, X } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'
import { ChatHeaderDrawer } from './ChatHeaderDrawer'

interface ChatHeaderProps {
	title: string
	details: string
	mode: ChatMode
	setMode: Dispatch<SetStateAction<ChatMode>>
	setSearchValue: Dispatch<SetStateAction<string>>
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ title, details, mode, setMode, setSearchValue }) => {
	const handleClick = () => {
		if (mode === 'search') setSearchValue('')
		setMode(prev => (prev === 'default' ? 'search' : 'default'))
	}

	return (
		<div className="border-b border-border bg-[#171717] px-4 h-15.25 flex items-center justify-between">
			<div className="flex flex-col">
				<span className="text-white font-medium">{title}</span>
				<span className="text-xs text-sidebar-ring">{details}</span>
			</div>

			<div className="p-2 relative">
				<AnimatePresence mode="wait">
					{mode === 'default' ? (
						<motion.div
							key="search"
							className="flex items-center gap-x-1"
							initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
							animate={{ rotate: 0, opacity: 1, scale: 1 }}
							exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
							transition={{ duration: 0.2 }}
						>
							<Search
								onClick={handleClick}
								className="text-sidebar-ring size-4.5 cursor-pointer"
							/>

							<ChatHeaderDrawer
								title={title}
								details={details}
							>
								<EllipsisVertical className="text-sidebar-ring size-4.5 cursor-pointer" />
							</ChatHeaderDrawer>
						</motion.div>
					) : (
						<motion.div
							key="close"
							initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
							animate={{ rotate: 0, opacity: 1, scale: 1 }}
							exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
							transition={{ duration: 0.2 }}
						>
							<X className="text-sidebar-ring size-5.5 cursor-pointer" />
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	)
}

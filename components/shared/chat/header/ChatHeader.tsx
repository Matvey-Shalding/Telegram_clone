'use client'

import { ChatMode } from '@/@types/ChatMode'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, EllipsisVertical, Search, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
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

	const router = useRouter()
	return (
		<div className="border-b border-border bg-sidebar pl-2 min-h-15.25 flex items-center justify-between">
			<div className="flex items-center gap-2.5">
				<ArrowLeft
					onClick={() => router.push('/')}
					className="text-muted-foreground size-5 cursor-pointer"
				/>
				<div className="flex flex-col">
					<span className="text-white font-medium">{title}</span>
					<span className="text-xs text-muted-foreground">{details}</span>
				</div>
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
							<div className="p-2 pr-0">
								<Search
									onClick={handleClick}
									className="text-muted-foreground size-5 cursor-pointer"
								/>
							</div>
							<ChatHeaderDrawer
								title={title}
								details={details}
							>
								<div className="p-2 pl-0">
									<EllipsisVertical className="text-muted-foreground size-5 cursor-pointer" />
								</div>
							</ChatHeaderDrawer>
						</motion.div>
					) : (
						<motion.div
							className="p-2"
							onClick={() => setMode('default')}
							key="close"
							initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
							animate={{ rotate: 0, opacity: 1, scale: 1 }}
							exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
							transition={{ duration: 0.2 }}
						>
							<X
								onClick={() => setMode('default')}
								className="text-sidebar-ring size-5 cursor-pointer"
							/>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	)
}

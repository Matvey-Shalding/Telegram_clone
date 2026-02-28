'use client'

import { Card } from '@/components/ui'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ChatMessageActionsDropdown } from './ChatMessageActionsDropdown'
import { ChatMessageStatus } from './ChatMessageStatus'

interface Props {
	image: string
	isMine: boolean
	isOptimistic: boolean
	time: string
	isLastMessage?: boolean
	dropdown: {
		isOpen: boolean
		setIsOpen: (v: boolean) => void
		onDelete: (e: React.MouseEvent) => void
	}
}

export const ChatImageMessage = ({ image, isMine, isOptimistic, time, isLastMessage, dropdown }: Props) => {
	const shouldAnimateIn = isLastMessage && !isOptimistic

	return (
		<motion.div
			layout
			initial={false}
			animate={shouldAnimateIn ? { opacity: [0, 1], y: [12, 0], scale: [0.98, 1] } : undefined}
			transition={{
				layout: { type: 'spring', stiffness: 500, damping: 40 },
				duration: 0.22
			}}
			className="flex flex-col gap-1"
		>
			<Card
				onClick={() => !isOptimistic && dropdown.setIsOpen(!dropdown.isOpen)}
				className={cn(
					'relative p-0 overflow-hidden border shadow-none cursor-pointer group rounded-2xl',
					isOptimistic && 'opacity-70 border-dashed',
					isMine ? 'bg-primary/5' : 'bg-muted'
				)}
				style={{ width: 260 }}
			>
				<img
					src={image}
					alt="Sent image"
					className="w-[260px] h-[180px] object-cover"
				/>

				<ChatMessageActionsDropdown
					isMine={isMine}
					isOpen={dropdown.isOpen}
					setIsOpen={dropdown.setIsOpen}
					handleDelete={dropdown.onDelete}
					onlyDelete
				/>
			</Card>

			<div className={cn('flex items-center gap-1 text-[11px] px-1 text-muted-foreground', isMine ? 'justify-end' : 'justify-start')}>
				<ChatMessageStatus
					time={time}
					isMine={isMine}
					isOptimistic={isOptimistic}
				/>
			</div>
		</motion.div>
	)
}

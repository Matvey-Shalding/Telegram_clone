'use client'

import { Card } from '@/components/ui'
import { Highlight } from '@/components/ui/Highlighted'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ChatMessageActionsDropdown } from './ChatMessageActionsDropdown'
import { ChatMessageStatus } from './ChatMessageStatus'

interface Props {
	content: string
	searchValue: string
	isActiveMatch?: boolean
	isMine: boolean
	isOptimistic: boolean
	wasSeen: boolean
	time: string
	dropdown: {
		isOpen: boolean
		setIsOpen: (v: boolean) => void
		onEdit: (e: React.MouseEvent) => void
		onDelete: (e: React.MouseEvent) => void
		onCopy: (e: React.MouseEvent) => void
	}
	messageId:string
}

export const ChatMessageBubble = ({ content, searchValue, isActiveMatch, isMine, isOptimistic, time, dropdown, wasSeen,messageId }: Props) => {

	return (
		<motion.div
			layout
			// simple mount animation (soft slide + fade)
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.18, ease: 'easeOut' }}
			// keep wrapper layoutless so existing styles remain untouched
			style={{ display: 'contents' }}
		>
			<Card
				onClick={() => !isOptimistic && dropdown.setIsOpen(!dropdown.isOpen)}
				className={cn(
					'relative cursor-pointer max-w-[70%] px-3 py-1.75 text-sm border shadow-none whitespace-pre-wrap break-words leading-tight group',
					'rounded-lg',
					isMine ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted text-muted-foreground hover:bg-muted/90',
					isOptimistic && 'opacity-70 border-dashed'
				)}
			>
				<ChatMessageActionsDropdown
				messageId={messageId}
					isMine={isMine}
					isOpen={dropdown.isOpen}
					setIsOpen={dropdown.setIsOpen}
					handleEdit={dropdown.onEdit}
					handleDelete={dropdown.onDelete}
					handleCopy={dropdown.onCopy}
				/>

				<div className="flex items-end gap-2">
					<Highlight
						text={content}
						query={searchValue}
						isActive={isActiveMatch}
						invertColors={!isMine}
					/>

					<ChatMessageStatus
						wasSeen={wasSeen}
						time={time}
						isMine={isMine}
						isOptimistic={isOptimistic}
					/>
				</div>
			</Card>
		</motion.div>
	)
}

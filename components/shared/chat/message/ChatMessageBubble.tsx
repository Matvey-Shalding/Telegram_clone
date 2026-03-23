'use client'

import { ChatMode } from '@/@types/ChatMode'
import { ReactionWithUser } from '@/@types/ReactionWithUser'
import { Card } from '@/components/ui'
import { Highlight } from '@/components/ui/Highlighted'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import React from 'react'
import { ChatMessageStatus } from './ChatMessageStatus'
import { MessageReactionsRow } from './MessageReaction'
import { ChatMessageDropdown } from './dropdown/ChatMessageDropdown'

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
	messageId: string
	reactions: ReactionWithUser[]
	mode: ChatMode
}

export const ChatMessageBubble = ({
	content,
	searchValue,
	isActiveMatch,
	isMine,
	isOptimistic,
	time,
	dropdown,
	wasSeen,
	messageId,
	reactions,
	mode
}: Props) => {
	const hasReactions = reactions && reactions.length > 0

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
				<ChatMessageDropdown
					reactions={reactions}
					messageId={messageId}
					isMine={isMine}
					isOpen={dropdown.isOpen}
					setIsOpen={dropdown.setIsOpen}
					handleEdit={dropdown.onEdit}
					handleDelete={dropdown.onDelete}
					handleCopy={dropdown.onCopy}
				/>

				{/* If there are no reactions — keep the original single-row layout */}
				{!hasReactions ? (
					<div className="flex items-end gap-2">
						<Highlight
							disabled={mode !== 'search'}
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
				) : (
					/* If there ARE reactions — place content in its own row,
             and render reactions (left) + status (right) in the second row */
					<div>
						{/* Content row */}
						<div className="mb-0.5">
							<Highlight
								disabled={mode !== 'search'}
								text={content}
								query={searchValue}
								isActive={isActiveMatch}
								invertColors={!isMine}
							/>
						</div>

						{/* Reaction + Status row (reactions on left; status on right) */}
						<div className="flex items-end justify-between gap-3">
							<MessageReactionsRow reactions={reactions} />
							<div className="flex-shrink-0">
								<ChatMessageStatus
									wasSeen={wasSeen}
									time={time}
									isMine={isMine}
									isOptimistic={isOptimistic}
								/>
							</div>
						</div>
					</div>
				)}
			</Card>
		</motion.div>
	)
}

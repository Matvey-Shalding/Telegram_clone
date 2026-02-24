'use client'

import { ChatMessage as Message, ServerMessage } from '@/@types/ChatMessage'
import { AvatarWithBadge } from '@/components/shared/AvatarWithBadge'
import { Card } from '@/components/ui'
import { Highlight } from '@/components/ui/Highlighted'
import { REACT_QUERY_KEYS } from '@/config/reactQueryKeys'
import { useCurrentSession } from '@/hooks/useCurrentSession'
import { formatMessageTime } from '@/lib/formatMessageTime'
import { cn } from '@/lib/utils'
import { Api } from '@/services/clientApi'
import { useQueryClient } from '@tanstack/react-query'
import { CheckCheck, Clock } from 'lucide-react'
import React, { Dispatch, SetStateAction, memo, useState } from 'react'
import toast from 'react-hot-toast'
import { ChatMessageActionsDropdown } from './ChatMessageActionsDropdown'
import { DateBadge } from './DateBadge'

interface Props {
	className?: string
	message: Message
	searchValue: string
	isActiveMatch?: boolean
	setIsCalendarOpen: Dispatch<SetStateAction<boolean>>
	isLastMessage?: boolean
}

export const ChatMessage: React.FC<Props> = memo(({ className, setIsCalendarOpen, message, searchValue, isActiveMatch, isLastMessage }) => {
	const session = useCurrentSession()
	const isMine = session?.user.id === message.senderId
	const isOptimistic = message.optimistic === true

	// ⚠️ Do NOT render empty content
	if (!message.content) return null

	const time = formatMessageTime(message.createdAt)

	// dropdown open state
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)

	const queryClient = useQueryClient()

	const handleEdit = (e: React.MouseEvent) => {}
	const handleDelete = async (e: React.MouseEvent) => {
		e.stopPropagation()
		setIsDropdownOpen(false)

		queryClient.setQueryData<ServerMessage[]>([REACT_QUERY_KEYS.MESSAGES, message.conversationId], old =>
			old?.filter(m => m.id !== message.id)
		)

		try {
			await Api.messages.remove(message.id)
		} catch (err) {
			// Refetch messages on fail
			queryClient.invalidateQueries({
				queryKey: [REACT_QUERY_KEYS.MESSAGES, message.conversationId]
			})

			toast.error('Failed to delete message')
		}
	}
	const handleCopy = (e: React.MouseEvent) => {
		e.stopPropagation()
		navigator.clipboard.writeText(message.content ?? '')
		toast.success('Copied to clipboard')
		setIsDropdownOpen(false)
	}
	const handleClickBubble = () => {
		if (!isOptimistic) {
			setIsDropdownOpen(prev => !prev)
		}
	}

	return (
		<div className={cn('flex flex-col', message.isSameSender ? 'mt-1' : 'mt-3')}>
			{/* Date badge */}
			{message.showDateBadge && (
				<DateBadge
					setOpen={setIsCalendarOpen}
					date={message.createdAt}
				/>
			)}

			<div
				className={cn('w-full flex items-end gap-2 px-3', isMine ? 'justify-end' : 'justify-start', className, isLastMessage && 'mb-20')}
			>
				{/* Avatar left */}
				{!isMine && <AvatarWithBadge className="size-7 shrink-0" />}

				{/* Message bubble */}
				<Card
					onClick={handleClickBubble}
					className={cn(
						'relative cursor-pointer max-w-[70%] px-3 py-1.75 text-sm shadow-none border whitespace-pre-wrap break-words leading-tight transition-all group',
						'rounded-lg',
						isMine
							? 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80'
							: 'bg-muted text-muted-foreground hover:bg-muted/90 active:bg-muted/80',
						isOptimistic && 'opacity-70 border-dashed'
					)}
				>
					{/* Dropdown menu */}
					<ChatMessageActionsDropdown
						isMine={isMine}
						isOpen={isDropdownOpen}
						setIsOpen={setIsDropdownOpen}
						handleEdit={handleEdit}
						handleDelete={handleDelete}
						handleCopy={handleCopy}
					/>

					{/* Content + time + status */}
					<div className="flex items-end gap-2">
						<Highlight
							text={message.content}
							query={searchValue}
							isActive={isActiveMatch}
							invertColors={!isMine}
						/>

						<div className="flex items-center gap-x-1 shrink-0">
							<span className="text-[10px] opacity-70 leading-none">{time}</span>

							{/* Status icon (only mine) */}
							{isMine &&
								(isOptimistic ? <Clock className="size-3 animate-spin-slow opacity-70" /> : <CheckCheck className="size-3 opacity-80" />)}
						</div>
					</div>
				</Card>

				{/* Avatar right */}
				{isMine && <AvatarWithBadge className="size-7 shrink-0" />}
			</div>
		</div>
	)
})

ChatMessage.displayName = 'ChatMessage'

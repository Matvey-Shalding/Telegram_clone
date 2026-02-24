'use client'

import { ChatMessage as Message } from '@/@types/ChatMessage'
import { ChatMode } from '@/@types/ChatMode'
import { AvatarWithBadge } from '@/components/shared/AvatarWithBadge'
import { useMessageActions } from '@/hooks/messages/useMessageActions'
import { useCurrentSession } from '@/hooks/useCurrentSession'
import { formatMessageTime } from '@/lib/formatMessageTime'
import { cn } from '@/lib/utils'
import { Dispatch, memo, SetStateAction } from 'react'
import { DateBadge } from '../DateBadge'
import { ChatMessageBubble } from './ChatMessageBubble'

interface Props {
	message: Message
	searchValue: string
	isActiveMatch?: boolean
	isLastMessage?: boolean
	setIsCalendarOpen: Dispatch<SetStateAction<boolean>>
	setEditedValue: Dispatch<SetStateAction<string>>
	setMode: Dispatch<SetStateAction<ChatMode>>
	className?: string
}

export const ChatMessage = memo(
	({ message, searchValue, isActiveMatch, isLastMessage, setIsCalendarOpen, setEditedValue, setMode, className }: Props) => {
		const session = useCurrentSession()
		const isMine = session?.user.id === message.senderId
		const isOptimistic = message.optimistic === true

		if (!message.content) return null

		const time = formatMessageTime(message.createdAt)

		const actions = useMessageActions(message, setEditedValue, setMode)

		return (
			<div className={cn('flex flex-col', message.isSameSender ? 'mt-1' : 'mt-3')}>
				{message.showDateBadge && (
					<DateBadge
						setOpen={setIsCalendarOpen}
						date={message.createdAt}
					/>
				)}

				<div
					className={cn('w-full flex items-end gap-2 px-3', isMine ? 'justify-end' : 'justify-start', isLastMessage && 'mb-20', className)}
				>
					{!isMine && <AvatarWithBadge className="size-7 shrink-0" />}

					<ChatMessageBubble
						content={message.content}
						searchValue={searchValue}
						isActiveMatch={isActiveMatch}
						isMine={isMine}
						isOptimistic={isOptimistic}
						time={time}
						dropdown={{
							isOpen: actions.isOpen,
							setIsOpen: actions.setIsOpen,
							onEdit: actions.handleEdit,
							onDelete: actions.handleDelete,
							onCopy: actions.handleCopy
						}}
					/>

					{isMine && <AvatarWithBadge className="size-7 shrink-0" />}
				</div>
			</div>
		)
	}
)

ChatMessage.displayName = 'ChatMessage'

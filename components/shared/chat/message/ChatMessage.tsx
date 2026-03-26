'use client'

import { ChatMode } from '@/@types/ChatMode'
import { ChatMessage as Message } from '@/@types/Message'
import { useMessageActions } from '@/hooks/message/actions/useMessageActions'
import { useCurrentSession } from '@/hooks/useCurrentSession'
import { formatTime } from '@/lib/message.helpers'
import { cn } from '@/lib/utils'
import { Dispatch, memo, SetStateAction } from 'react'
import { DateBadge } from '../ui/DateBadge'
import { ChatImageMessage } from './ChatImageMessage'
import { ChatMessageBubble } from './ChatMessageBubble'
import { UserProfileDialog } from './UserProfileDialog'

interface Props {
	message: Message
	searchValue: string
	isActiveMatch?: boolean
	isLastMessage?: boolean
	setIsCalendarOpen: Dispatch<SetStateAction<boolean>>
	setEditedValue: Dispatch<SetStateAction<string>>
	setMode: Dispatch<SetStateAction<ChatMode>>
	lastReadAt: Date | null | undefined
	className?: string
	mode: ChatMode
}

export const ChatMessage = memo(
	({
		message,
		searchValue,
		isActiveMatch,
		isLastMessage,
		setIsCalendarOpen,
		setEditedValue,
		setMode,
		className,
		lastReadAt,
		mode
	}: Props) => {
		const session = useCurrentSession()
		const isMine = session?.user.id === message.senderId
		const isOptimistic = message.optimistic === true

		const wasSeen = lastReadAt ? +message.createdAt <= +new Date(lastReadAt) : false

		const isTextMessage = !!message.content
		const isImageMessage = !!message.image

		const time = formatTime(message.createdAt)
		const actions = useMessageActions(message, setEditedValue, setMode)

		if (!isTextMessage && !isImageMessage) return null

		return (
			<div className={cn('flex flex-col', 'mt-3')}>
				{message.showDateBadge && (
					<DateBadge
						setOpen={setIsCalendarOpen}
						date={message.createdAt}
					/>
				)}

				<div
					className={cn('w-full flex items-end gap-2 px-3', isMine ? 'justify-end' : 'justify-start', isLastMessage && 'mb-20', className)}
				>
					{!isMine && <UserProfileDialog user={message.sender} />}

					{/* TEXT MESSAGE */}
					{isTextMessage && (
						<ChatMessageBubble
							mode={mode}
							reactions={message.reactions}
							messageId={message.id}
							wasSeen={wasSeen}
							content={message.content!}
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
					)}

					{isImageMessage && (
						<ChatImageMessage
							wasSeen={wasSeen}
							isLastMessage={isLastMessage}
							image={message.image!}
							isMine={isMine}
							isOptimistic={isOptimistic}
							time={time}
							dropdown={{
								isOpen: actions.isOpen,
								setIsOpen: actions.setIsOpen,
								onDelete: actions.handleDelete
							}}
						/>
					)}

					{isMine && <UserProfileDialog user={message.sender} />}
				</div>
			</div>
		)
	}
)

ChatMessage.displayName = 'ChatMessage'

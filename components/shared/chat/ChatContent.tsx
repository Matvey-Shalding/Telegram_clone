'use client'

import { Message } from '@/generated/prisma/client'
import React from 'react'
import { Virtuoso } from 'react-virtuoso'
import { ChatMessage } from './ChatMessage'
import { DateBadge } from './DateBadge'

import { useMessages } from '@/hooks/useMessages'
import { cn } from '@/lib/utils'
import { MessagesScrollbar } from './MessagesScrollbar'

interface Props {
	className?: string
	messages: Message[] | null
}

export const ChatContent: React.FC<Props> = ({ className, messages }) => {
	if (!messages || messages.length === 0) {
		return <div className="p-4 text-muted-foreground">Chat is empty</div>
	}
	const { enhancedMessages, loadOlderMessages } = useMessages(messages)

	return (
		<div className={cn('h-full w-full p-6 pr-0', className)}>
			<Virtuoso
				data={enhancedMessages}
				initialTopMostItemIndex={enhancedMessages.length - 1}
				computeItemKey={(_, item) => item.id}
				startReached={loadOlderMessages}
				components={{
					Scroller: MessagesScrollbar
				}}
				style={{ height: '100%', width: '100%' }}
				itemContent={(_, message: any) => (
					<div className={cn('flex flex-col', message.isSameSender ? 'mt-1' : 'mt-3')}>
						{message.showDateBadge && <DateBadge date={new Date(message.createdAt)} />}
						<ChatMessage message={message} />
					</div>
				)}
			/>
		</div>
	)
}

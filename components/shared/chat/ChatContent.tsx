'use client'

import { ChatMessage as ChatMessageType } from '@/@types/ChatMessage'
import { ChatMode } from '@/@types/ChatMode'
import { Message } from '@/generated/prisma/client'
import { useMessages } from '@/hooks'
import { useCalendar } from '@/hooks/messages/useCalendar'
import { useSearch } from '@/hooks/messages/useSearch'
import { useVirtuoso } from '@/hooks/messages/useVirtuoso'
import { Chat } from '@/lib/chat'
import { cn } from '@/lib/utils'
import { Api } from '@/services/clientApi'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useMemo } from 'react'
import { Virtuoso } from 'react-virtuoso'
import { ChatCalendar } from './ChatCalendar'
import { ChatMessage } from './ChatMessage'
import { ChatSearch } from './ChatSearch'
import { MessagesScrollbar } from './MessagesScrollbar'

interface Props {
	className?: string
	searchValue: string
	mode: ChatMode
	conversationId: string | undefined
}

export const ChatContent: React.FC<Props> = ({ className, mode, conversationId, searchValue }) => {
	const { data, isLoading, isError } = useQuery<Message[]>({
		queryKey: ['messages', conversationId],
		queryFn: () => Api.messages.getAll(conversationId ?? ''),
		enabled: !!conversationId
	})

	useEffect(() => {
		console.log('fetched messages:', data?.at(-1))
	}, [data])

	const { messages, loadOlderMessages } = useMessages(data)

	const chat = useMemo(() => {
		return new Chat(messages as any)
	}, [messages])

	const { virtuosoRef } = useVirtuoso(messages.length, mode)

	const { isCalendarOpen, setIsCalendarOpen, selectedDate, handleDateSelect } = useCalendar(messages, virtuosoRef)

	const { matchedMessageIndexes, currentMatchCursor, scrollToMatch } = useSearch(chat, messages, searchValue, mode, virtuosoRef)

	/**
	 * 6️⃣ Guard states
	 */
	if (isLoading) {
		return <div>Loading messages...</div>
	}

	if (isError) {
		return <div>Error loading messages</div>
	}

	if (!conversationId) {
		return <div>Conversation not found</div>
	}

	/**
	 * 7️⃣ Render
	 */
	return (
		<div className={cn('h-full w-full relative', className)}>
			<ChatCalendar
				isCalendarOpen={isCalendarOpen}
				setIsCalendarOpen={setIsCalendarOpen}
				selectedDate={selectedDate}
				handleDateSelect={handleDateSelect}
			/>

			<ChatSearch
				mode={mode}
				matchedMessageIndexes={matchedMessageIndexes}
				currentMatchCursor={currentMatchCursor}
				scrollToMatch={scrollToMatch}
			/>

			<Virtuoso
				ref={virtuosoRef}
				data={messages}
				computeItemKey={(_, item) => item.id}
				startReached={loadOlderMessages}
				components={{ Scroller: MessagesScrollbar }}
				style={{ height: '100%', width: '100%' }}
				itemContent={(index, message: ChatMessageType) => {
					const isActive = matchedMessageIndexes[currentMatchCursor] === index

					const isLastMessage = index === messages.length - 1

					return (
						<ChatMessage
							key={message.id}
							isLastMessage={isLastMessage}
							message={message}
							searchValue={searchValue}
							isActiveMatch={isActive}
							setIsCalendarOpen={setIsCalendarOpen}
						/>
					)
				}}
			/>
		</div>
	)
}

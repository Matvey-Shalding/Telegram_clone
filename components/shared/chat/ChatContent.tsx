'use client'

import { ChatMode } from '@/@types/ChatMode'
import { authClient } from '@/auth-client'
import { Message } from '@/generated/prisma/client'
import { useMessages } from '@/hooks'
import { useCalendar } from '@/hooks/messages/useCalendar'
import { useSearch } from '@/hooks/messages/useSearch'
import { useVirtuoso } from '@/hooks/messages/useVirtuoso'
import { Chat } from '@/lib/chat'
import { cn } from '@/lib/utils'
import { Api } from '@/services/clientApi'
import { useMutationState, useQuery } from '@tanstack/react-query'
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
	/**
	 * 1️⃣ Fetch real messages
	 */
	const { data, isLoading } = useQuery<Message[]>({
		queryKey: ['messages', conversationId],
		queryFn: () => Api.messages.getAll(conversationId ?? ''),
		enabled: !!conversationId
	})

	/**
	 * 2️⃣ Read pending sendMessage mutations (optimistic source)
	 */
	const pendingVariables = useMutationState({
		filters: {
			mutationKey: ['sendMessage'],
			status: 'pending'
		},
		select: mutation =>
			mutation.state.variables as {
				conversationId: string
				content: string
				optimisticId: string
			}
	})

	useEffect(() => {
		console.log('fetched messages:', data)
	}, [data])

	const id = authClient.useSession().data?.user.id

	/**
	 * 3️⃣ Convert pending mutations → optimistic messages
	 */
	const optimisticMessages: Message[] = useMemo(() => {
		if (!pendingVariables?.length || !conversationId) return []

		return pendingVariables
			.filter(v => v.conversationId === conversationId)
			.map((v, index) => ({
				id: v.optimisticId,
				conversationId: v.conversationId,
				senderId: id!, // IMPORTANT: must exist in schema
				content: v.content ?? null,
				image: null,
				createdAt: new Date(),
				updatedAt: new Date(),
				seenBy: [],
				messageReactions: [],
				optimisticId: v.optimisticId as any
			}))
	}, [pendingVariables, conversationId])

	/**
	 * 4️⃣ Merge real + optimistic messages
	 */
	const allMessages = useMemo(() => {
		if (!data) return optimisticMessages

		// Collect optimisticIds that already have a real message
		const realOptimisticIds = new Set(data.map(m => m.optimisticId).filter(Boolean))

		// Keep only optimistic messages that do NOT have a real counterpart
		const stillPending = optimisticMessages.filter(om => !realOptimisticIds.has(om.id))

		return [...data, ...stillPending]
	}, [data, optimisticMessages])

	/**
	 * 5️⃣ Message processing (windowing, metadata, etc.)
	 */
	const { messages, loadOlderMessages } = useMessages(allMessages)

	const chat = useMemo(() => {
		return new Chat(messages as any)
	}, [messages])

	const { virtuosoRef } = useVirtuoso(messages.length, mode)

	const { isCalendarOpen, setIsCalendarOpen, selectedDate, handleDateSelect } = useCalendar(messages, virtuosoRef)

	const { matchedMessageIndexes, currentMatchCursor, scrollToMatch } = useSearch(chat, messages, searchValue, mode, virtuosoRef)

	/**
	 * 6️⃣ Guard states
	 */
	if (isLoading && !messages.length) {
		return <div>Loading messages...</div>
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
				computeItemKey={(_, item) => item.optimisticId ?? item.id}
				startReached={loadOlderMessages}
				components={{ Scroller: MessagesScrollbar }}
				style={{ height: '100%', width: '100%' }}
				itemContent={(index, message: any) => {
					const isActive = matchedMessageIndexes[currentMatchCursor] === index

					return (
						<ChatMessage
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

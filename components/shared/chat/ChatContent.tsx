'use client'

import { ChatMode } from '@/@types/ChatMode'
import { cn } from '@/lib/utils'
import React, { useEffect } from 'react'

import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/button'
import { Message } from '@/generated/prisma/client'
import { useChatController } from '@/hooks/useChatController'
import { getMessageSonnerPayload } from '@/lib/getMessageSonnerPayload'
import { pusherClient } from '@/lib/pusher'
import { showMessageSonner } from '@/lib/showMessageSonner'
import { currentConversationId } from '@/store'
import { useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { ChatCalendar } from './ChatCalendar'
import { ChatSearch } from './ChatSearch'
import { ChatVirtuoso } from './ChatVirtuoso'

interface Props {
	className?: string
	searchValue: string
	mode: ChatMode
}

export const ChatContent: React.FC<Props> = ({ className, mode, searchValue }) => {
	const [conversationId] = useAtom(currentConversationId)

	const {
		isLoading,
		isError,

		messages,
		virtuosoData,
		loadOlderMessages,
		virtuosoRef,

		isCalendarOpen,
		setIsCalendarOpen,
		selectedDate,
		handleDateSelect,

		matchedMessageIndexes,
		currentMatchCursor,
		scrollToMatch
	} = useChatController(mode, searchValue)

	const scrollToBottom = () => {
		virtuosoRef.current?.scrollToIndex({
			index: 'LAST',
			align: 'end',
			behavior: 'smooth' // or "auto"
		})
	}

	const queryClient = useQueryClient()

	const messageHandler = async (message: Message) => {
		queryClient.setQueryData<Message[]>(['messages', conversationId], old => {
			const exists = old?.some(m => m.id === message.id)
			if (exists) return old
			return [...(old ?? []), message]
		})

		try {
			const sonnerData = await getMessageSonnerPayload(message)

			if (sonnerData) {
				showMessageSonner(sonnerData)
			}
		} catch (error) {}
	}

	useEffect(() => {
		if (conversationId) {
			pusherClient.subscribe(conversationId)

			scrollToBottom()

			pusherClient.bind('messages:new', messageHandler)
		}

		// Unsubscribe on unMount

		return () => {
			if (conversationId) {
				pusherClient.unsubscribe(conversationId)

				pusherClient.unbind('messages:new', messageHandler)
			}
		}
	}, [conversationId])

	if (isError) {
		return (
			<div className="h-full w-full grid place-content-center">
				<EmptyState
					title="Something went wrong"
					description="Failed to load data"
					action={
						<Button
							onClick={() => window.location.reload()}
							variant="outline"
						>
							Retry
						</Button>
					}
				/>
			</div>
		)
	}

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

			<ChatVirtuoso
				isLoading={isLoading}
				messages={messages}
				data={virtuosoData}
				virtuosoRef={virtuosoRef}
				loadOlderMessages={loadOlderMessages}
				searchValue={searchValue}
				activeMatchIndex={matchedMessageIndexes[currentMatchCursor]}
				setIsCalendarOpen={setIsCalendarOpen}
			/>
		</div>
	)
}

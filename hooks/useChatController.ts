// hooks/chat/useChatContent.ts
'use client'

import { ChatMessageSkeleton, VirtuosoMessage } from '@/@types/ChatMessage'
import { ChatMode } from '@/@types/ChatMode'
import { useCalendar, useMessages, useSearch, useVirtuoso } from '@/hooks'
import { useChatMessages } from '@/hooks/messages/useChatMessage'
import { Chat } from '@/lib'
import { currentConversationId } from '@/store'
import { useAtom } from 'jotai'
import { useMemo } from 'react'
import { useMessageSubscription } from './messages/useMessageSubscription'

export function useChatController(mode: ChatMode, searchValue: string) {
	// 1️⃣ fetch
	const { data, isLoading, isError } = useChatMessages()

	// 2️⃣ DTO + windowing
	const { messages, loadOlderMessages } = useMessages(data)

	// 3️⃣ virtuoso
	const { virtuosoRef } = useVirtuoso(messages.length, mode)

	// 4️⃣ calendar
	const { isCalendarOpen, setIsCalendarOpen, selectedDate, handleDateSelect } = useCalendar(messages, virtuosoRef)

	// 5️⃣ search
	const chat = useMemo(() => new Chat(messages as any), [messages])

	const { matchedMessageIndexes, currentMatchCursor, scrollToMatch } = useSearch(chat, messages, searchValue, mode, virtuosoRef)


	// 6️⃣ skeletons
	const skeletons: ChatMessageSkeleton[] = useMemo(
		() =>
			Array.from({ length: 10 }, (_, i) => ({
				id: `skeleton-${i}`,
				isMine: i % 2 === 0,
				type: 'skeleton'
			})),
		[]
	)

	const virtuosoData: VirtuosoMessage[] = useMemo(() => (isLoading ? skeletons : messages), [isLoading, skeletons, messages])

	return {
		// state
		isLoading,
		isError,

		// messages
		messages,
		virtuosoData,
		loadOlderMessages,

		// virtuoso
		virtuosoRef,

		// calendar
		isCalendarOpen,
		setIsCalendarOpen,
		selectedDate,
		handleDateSelect,

		// search
		matchedMessageIndexes,
		currentMatchCursor,
		scrollToMatch
	}
}

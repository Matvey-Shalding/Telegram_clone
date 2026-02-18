'use client'

import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { ChatMessageSkeleton, ChatMessage as ChatMessageType, VirtuosoMessage } from '@/@types/ChatMessage'
import { ChatMode } from '@/@types/ChatMode'
import { Message } from '@/generated/prisma/client'

import { useMessages } from '@/hooks'
import { useCalendar } from '@/hooks/messages/useCalendar'
import { useSearch } from '@/hooks/messages/useSearch'
import { useVirtuoso } from '@/hooks/messages/useVirtuoso'
import { Chat } from '@/lib/chat'
import { Api } from '@/services/clientApi'

/**
 * Skeleton data for Virtuoso
 */

const SKELETON_MESSAGES: ChatMessageSkeleton[] = Array.from({ length: 10 }, (_, i) => ({
	id: `skeleton-${i}`,
	isMine: i % 2 === 0,
	type: 'skeleton'
}))

interface UseChatControllerParams {
	conversationId: string | undefined
	mode: ChatMode
	searchValue: string
}

export function useChatController({ conversationId, mode, searchValue }: UseChatControllerParams) {
	// Fetch messages
	const { data, isLoading, isError } = useQuery<Message[]>({
		queryKey: ['messages', conversationId],
		queryFn: () => Api.messages.getAll(conversationId ?? ''),
		enabled: !!conversationId
	})

	// Client DTO
	const { messages, loadOlderMessages } = useMessages(data)

	const chat = useMemo(() => {
		return new Chat(messages as ChatMessageType[])
	}, [messages])

	// Virtualization logic
	const { virtuosoRef } = useVirtuoso(messages.length, mode)

	// Calendar logic
	const { isCalendarOpen, setIsCalendarOpen, selectedDate, handleDateSelect } = useCalendar(messages, virtuosoRef)

	// Search logic
	const { matchedMessageIndexes, currentMatchCursor, scrollToMatch } = useSearch(chat, messages, searchValue, mode, virtuosoRef)

	// Virtuoso data source (show skeletons when loading)
	const virtuosoData: VirtuosoMessage[] = isLoading ? SKELETON_MESSAGES : messages

	return {
		isLoading,
		isError,
		hasConversation: !!conversationId,
		messages,
		virtuosoData,
		virtuosoRef,
		loadOlderMessages,
		search: {
			matchedMessageIndexes,
			currentMatchCursor,
			scrollToMatch
		},
		calendar: {
			isOpen: isCalendarOpen,
			setOpen: setIsCalendarOpen,
			selectedDate,
			selectDate: handleDateSelect
		}
	}
}

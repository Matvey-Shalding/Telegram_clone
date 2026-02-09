'use client'

import { Message } from '@/generated/prisma/client'
import { Chat } from '@/lib/chat'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useMessages } from './useMessages'

export function useChatController(messages: Message[] | null, searchValue: string, mode: 'default' | 'search') {
	const virtuosoRef = useRef<any>(null)

	const { enhancedMessages, loadOlderMessages } = useMessages(messages)

	const chat = useMemo(() => new Chat(messages ?? []), [messages])

	useEffect(() => {
		if (mode === 'default') {
			virtuosoRef.current.scrollToIndex({
				index: enhancedMessages.length - 1,
				align: 'start',
				behavior: 'smooth'
			})
		}
	}, [mode])

	// Calendar
	const [isCalendarOpen, setIsCalendarOpen] = useState(false)
	const [selectedDate, setSelectedDate] = useState<Date | undefined>()

	const handleDateSelect = (date?: Date) => {
		if (!date || !virtuosoRef.current) return

		setSelectedDate(date)
		setIsCalendarOpen(false)

		const index = chat.findClosestIndexByDate(date, enhancedMessages)

		virtuosoRef.current.scrollToIndex({
			index,
			align: 'start',
			behavior: 'smooth'
		})
	}

	// Search
	const matchedMessageIndexes = useMemo(() => {
		return chat.findSearchMatches(searchValue, enhancedMessages)
	}, [searchValue, enhancedMessages])

	const [currentMatchCursor, setCurrentMatchCursor] = useState(0)

	useEffect(() => {
		if (!matchedMessageIndexes.length || !virtuosoRef.current) return

		setCurrentMatchCursor(0)

		virtuosoRef.current.scrollToIndex({
			index: matchedMessageIndexes[0],
			align: 'start',
			behavior: 'smooth'
		})
	}, [matchedMessageIndexes])

	const scrollToMatch = (direction: 'next' | 'prev') => {
		if (!matchedMessageIndexes.length || !virtuosoRef.current) return

		setCurrentMatchCursor(prev => {
			const next = direction === 'next' ? Math.min(prev + 1, matchedMessageIndexes.length - 1) : Math.max(prev - 1, 0)

			virtuosoRef.current.scrollToIndex({
				index: matchedMessageIndexes[next],
				align: 'start',
				behavior: 'smooth'
			})

			return next
		})
	}

	return {
		virtuosoRef,
		enhancedMessages,
		loadOlderMessages,

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

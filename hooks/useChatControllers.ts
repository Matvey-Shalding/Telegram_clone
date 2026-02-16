'use client'

import { Message } from '@/generated/prisma/client'
import { Chat } from '@/lib/chat'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useMessages } from './messages/useMessages'

export function useChatController(messages: Message[] | undefined, searchValue: string, mode: 'default' | 'search') {
	// ---- SAFETY NORMALIZATION ----
	// const messages = useMemo(() => {
	// 	return messages ? messages : []
	// }, [messages])

	// ---- REFS ----
	const virtuosoRef = useRef<any>(null)

	// ---- DERIVED DATA ----
	const { enhancedMessages, loadOlderMessages } = useMessages(messages)

	const chat = useMemo(() => {
		return new Chat(messages ?? [])
	}, [messages])

	// ---- AUTO SCROLL TO BOTTOM (DEFAULT MODE) ----
	useLayoutEffect(() => {
		if (mode !== 'default' || !virtuosoRef.current || enhancedMessages.length === 0) {
			return
		}

		virtuosoRef.current.scrollToIndex({
			index: enhancedMessages.length - 1,
			align: 'end',
			behavior: 'auto'
		})
	}, [mode, enhancedMessages.length])

	// ---- CALENDAR STATE ----
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

	// ---- SEARCH ----
	const matchedMessageIndexes = useMemo(() => {
		if (!searchValue) return []
		return chat.findSearchMatches(searchValue, enhancedMessages)
	}, [searchValue, enhancedMessages, chat])

	const [currentMatchCursor, setCurrentMatchCursor] = useState(0)

	useLayoutEffect(() => {
		if (mode !== 'search' || !virtuosoRef.current || matchedMessageIndexes.length === 0) {
			return
		}

		setCurrentMatchCursor(0)

		virtuosoRef.current.scrollToIndex({
			index: matchedMessageIndexes[0],
			align: 'start',
			behavior: 'smooth'
		})
	}, [mode, matchedMessageIndexes])

	const scrollToMatch = (direction: 'next' | 'prev') => {
		if (!virtuosoRef.current || matchedMessageIndexes.length === 0) return

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

	// ---- RETURN API ----
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

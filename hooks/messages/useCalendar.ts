'use client'

import { ChatMessage } from '@/@types/ChatMessage'
import { Chat } from '@/lib/chat'
import { useMemo, useState } from 'react'

export function useCalendar(messages: ChatMessage[] = [], virtuosoRef: React.RefObject<any>) {
	const [isCalendarOpen, setIsCalendarOpen] = useState(false)
	const [selectedDate, setSelectedDate] = useState<Date | undefined>()

	const chat = useMemo(() => {
		return new Chat(messages ?? [])
	}, [messages])

	const handleDateSelect = (date?: Date) => {
		if (!date || !virtuosoRef.current) return

		setSelectedDate(date)
		setIsCalendarOpen(false)

		const index = chat.findClosestIndexByDate(date, messages)

		virtuosoRef.current.scrollToIndex({
			index,
			align: 'start',
			behavior: 'smooth'
		})
	}

	return {
		isCalendarOpen,
		setIsCalendarOpen,
		selectedDate,
		handleDateSelect
	}
}

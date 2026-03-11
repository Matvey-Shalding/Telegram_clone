'use client'

import { ChatMessage } from '@/@types/Message'
import { findClosestIndexByDate } from '@/lib/virtuoso.helpers'
import { useState } from 'react'
import { VirtuosoHandle } from 'react-virtuoso'

export function useCalendar(messages: ChatMessage[] = [], virtuosoRef: React.RefObject<VirtuosoHandle | null>) {
	const [isCalendarOpen, setIsCalendarOpen] = useState(false)
	const [selectedDate, setSelectedDate] = useState<Date | undefined>()

	const handleDateSelect = (date?: Date) => {
		if (!date || !virtuosoRef.current) return

		setSelectedDate(date)
		setIsCalendarOpen(false)

		const index = findClosestIndexByDate(date, messages)

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

'use client'

import { Calendar } from '@/components/ui/calendar'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import React from 'react'
interface Props {
	className?: string
	isCalendarOpen: boolean
	setIsCalendarOpen: (open: boolean) => void
	selectedDate: Date | undefined
	handleDateSelect: (date: Date | undefined) => void
}
export const ChatCalendar: React.FC<Props> = ({ className, isCalendarOpen, setIsCalendarOpen, selectedDate, handleDateSelect }) => {
	const today = new Date()

	return (
		<Dialog
			open={isCalendarOpen}
			onOpenChange={setIsCalendarOpen}
		>
			<DialogContent
				className="w-70 p-2"
				showCloseButton={false}
			>
				<Calendar
					disabled={d => d > today}
					fixedWeeks
					weekStartsOn={1}
					selected={selectedDate}
					onSelect={handleDateSelect}
					mode="single"
					className="w-full"
				/>
			</DialogContent>
		</Dialog>
	)
}

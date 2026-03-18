'use client'

import { Calendar } from '@/components/ui/calendar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import React from 'react'

interface Props {
	isCalendarOpen: boolean
	setIsCalendarOpen: (open: boolean) => void
	selectedDate: Date | undefined
	handleDateSelect: (date: Date | undefined) => void
}

export const ChatCalendar: React.FC<Props> = ({ isCalendarOpen, setIsCalendarOpen, selectedDate, handleDateSelect }) => {
	const today = new Date()

	return (
		<Dialog
			open={isCalendarOpen}
			onOpenChange={setIsCalendarOpen}
		>
			<DialogContent
				className="w-70 p-3 gap-3"
				showCloseButton={false}
			>
				<DialogHeader className="pb-2 border-b border-border gap-1">
					<DialogTitle className="text-sm font-semibold">Jump to date</DialogTitle>
					<DialogDescription className="text-xs">Select a day to navigate the conversation.</DialogDescription>
				</DialogHeader>

				<div className="pt-1">
					<Calendar
						disabled={d => d > today}
						fixedWeeks
						weekStartsOn={1}
						selected={selectedDate}
						onSelect={handleDateSelect}
						mode="single"
						className="w-full rounded-md"
					/>
				</div>
			</DialogContent>
		</Dialog>
	)
}

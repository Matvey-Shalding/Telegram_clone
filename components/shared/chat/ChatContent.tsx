'use client'

import { Message } from '@/generated/prisma/client'
import React, { useRef, useState } from 'react'
import { Virtuoso } from 'react-virtuoso'
import { ChatMessage } from './ChatMessage'
import { DateBadge } from './DateBadge'

import { Calendar } from '@/components/ui/calendar'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useMessages } from '@/hooks/useMessages'
import { cn } from '@/lib/utils'
import { MessagesScrollbar } from './MessagesScrollbar'

interface Props {
	className?: string
	messages: Message[] | null
}

export const ChatContent: React.FC<Props> = ({ className, messages }) => {
	if (!messages || messages.length === 0) {
		return <div className="p-4 text-muted-foreground">Chat is empty</div>
	}

	const { enhancedMessages, loadOlderMessages } = useMessages(messages)

	const virtuoso = useRef<any>(null)

	const [open, setOpen] = useState(false)
	const [selected, setSelected] = useState<Date>()

	function findClosestIndex(date: Date) {
		const target = date.setHours(0, 0, 0, 0)

		const badgeIndexes = enhancedMessages.map((m, i) => (m.showDateBadge ? i : null)).filter(i => i !== null) as number[]

		const badgeDates = badgeIndexes.map(i => new Date(enhancedMessages[i].createdAt).setHours(0, 0, 0, 0))

		for (let i = 0; i < badgeDates.length; i++) {
			if (badgeDates[i] === target) return badgeIndexes[i]
		}

		for (let i = 0; i < badgeDates.length; i++) {
			if (badgeDates[i] > target) return badgeIndexes[i]
		}

		return badgeIndexes[badgeIndexes.length - 1]
	}

	const handleSelect = (date: Date | undefined) => {
		if (!date) return

		setSelected(date)
		setOpen(false)

		const index = findClosestIndex(date)

		if (virtuoso.current !== null) {
			virtuoso.current.scrollToIndex({
				index: index,
				align: 'start',
				behavior: 'smooth'
			})
		}
	}

	const today = new Date()

	return (
		<div className={cn('h-full w-full p-6 pr-0', className)}>
			<Dialog
				open={open}
				onOpenChange={setOpen}
			>
				<DialogContent
					className="w-70 p-2"
					showCloseButton={false}
				>
					<Calendar
						disabled={date => date > today}
						fixedWeeks
						weekStartsOn={1}
						selected={selected}
						onSelect={handleSelect}
						mode="single"
						className="w-full"
					/>
				</DialogContent>
			</Dialog>

			<Virtuoso
				ref={virtuoso}
				data={enhancedMessages}
				initialTopMostItemIndex={enhancedMessages.length - 1}
				computeItemKey={(_, item) => item.id}
				startReached={loadOlderMessages}
				components={{
					Scroller: MessagesScrollbar
				}}
				style={{ height: '100%', width: '100%' }}
				itemContent={(_, message: any) => (
					<div className={cn('flex flex-col', message.isSameSender ? 'mt-1' : 'mt-3')}>
						{message.showDateBadge && (
							<DateBadge
								setOpen={setOpen}
								date={new Date(message.createdAt)}
							/>
						)}
						<ChatMessage message={message} />
					</div>
				)}
			/>
		</div>
	)
}

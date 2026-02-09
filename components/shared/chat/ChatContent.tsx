'use client'

import { Calendar } from '@/components/ui/calendar'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Message } from '@/generated/prisma/client'
import { useChatController } from '@/hooks/useChatControllers'
import { cn } from '@/lib/utils'
import { ArrowDown, ArrowUp } from 'lucide-react'
import React from 'react'
import { Virtuoso } from 'react-virtuoso'
import { ChatMessage } from './ChatMessage'
import { DateBadge } from './DateBadge'
import { MessagesScrollbar } from './MessagesScrollbar'

interface Props {
	className?: string
	messages: Message[] | null
	searchValue: string
	mode: 'default' | 'search'
}

export const ChatContent: React.FC<Props> = ({ className, mode, messages, searchValue }) => {
	if (!messages || messages.length === 0) {
		return <div className="p-4 text-muted-foreground">Chat is empty</div>
	}

	const {
		virtuosoRef,
		enhancedMessages,
		loadOlderMessages,
		isCalendarOpen,
		setIsCalendarOpen,
		selectedDate,
		handleDateSelect,
		matchedMessageIndexes,
		currentMatchCursor,
		scrollToMatch
	} = useChatController(messages, searchValue,mode)

	const today = new Date()

	return (
		<div className={cn('h-full w-full p-6 pr-0 relative', className)}>
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

			{matchedMessageIndexes.length > 0 && mode === 'search' && (
				<div className="absolute right-4 bottom-4 z-10 flex gap-2">
					<button
						onClick={() => scrollToMatch('prev')}
						disabled={currentMatchCursor === 0}
						className="rounded-full size-8 grid place-items-center border text-sm disabled:opacity-50"
					>
						<ArrowDown className="size-4" />
					</button>

					<button
						onClick={() => scrollToMatch('next')}
						disabled={currentMatchCursor === matchedMessageIndexes.length - 1}
						className="rounded-full size-8 grid place-items-center border text-sm disabled:opacity-50"
					>
						<ArrowUp className="size-4" />
					</button>
				</div>
			)}

			<Virtuoso
				ref={virtuosoRef}
				data={enhancedMessages}
				initialTopMostItemIndex={enhancedMessages.length - 1}
				computeItemKey={(_, item) => item.id}
				startReached={loadOlderMessages}
				components={{ Scroller: MessagesScrollbar }}
				style={{ height: '100%', width: '100%' }}
				itemContent={(index, message: any) => {
					const isActive = matchedMessageIndexes[currentMatchCursor] === index

					return (
						<div className={cn('flex flex-col', message.isSameSender ? 'mt-1' : 'mt-3')}>
							{message.showDateBadge && (
								<DateBadge
									setOpen={setIsCalendarOpen}
									date={new Date(message.createdAt)}
								/>
							)}
							<ChatMessage
								message={message}
								searchValue={searchValue}
								isActiveMatch={isActive}
							/>
						</div>
					)
				}}
			/>
		</div>
	)
}

'use client'

import { ChatMode } from '@/@types/ChatMode'
import { cn } from '@/lib/utils'
import React from 'react'

import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/button'
import { useChatController } from '@/hooks'
import { ChatCalendar } from './ChatCalendar'
import { ChatSearch } from './ChatSearch'
import { ChatVirtuoso } from './ChatVirtuoso'

interface Props {
	className?: string
	searchValue: string
	mode: ChatMode
	conversationId: string | undefined
}

export const ChatContent: React.FC<Props> = ({ className, mode, conversationId, searchValue }) => {
	const { isLoading, isError, hasConversation, messages, virtuosoData, virtuosoRef, loadOlderMessages, search, calendar } =
		useChatController({
			conversationId,
			mode,
			searchValue
		})

	/**
	 * Guards
	 */
	if (!hasConversation) {
		return (
			<div className="h-full w-full grid place-content-center">
				<EmptyState
					title="Something went wrong"
					description="Such conversation does not exist"
					action={
						<Button
							onClick={() => window.location.reload()}
							variant="outline"
						>
							Retry
						</Button>
					}
				/>
			</div>
		)
	}

	if (isError) {
		return (
			<div className="h-full w-full grid place-content-center">
				<EmptyState
					title="Something went wrong"
					description="Failed to load data"
					action={
						<Button
							onClick={() => window.location.reload()}
							variant="outline"
						>
							Retry
						</Button>
					}
				/>
			</div>
		)
	}

	return (
		<div className={cn('h-full w-full relative', className)}>
			<ChatCalendar
				isCalendarOpen={calendar.isOpen}
				setIsCalendarOpen={calendar.setOpen}
				selectedDate={calendar.selectedDate}
				handleDateSelect={calendar.selectDate}
			/>

			<ChatSearch
				mode={mode}
				matchedMessageIndexes={search.matchedMessageIndexes}
				currentMatchCursor={search.currentMatchCursor}
				scrollToMatch={search.scrollToMatch}
			/>

			<ChatVirtuoso
				isLoading={isLoading}
				messages={messages}
				data={virtuosoData}
				virtuosoRef={virtuosoRef}
				loadOlderMessages={loadOlderMessages}
				searchValue={searchValue}
				activeMatchIndex={search.matchedMessageIndexes[search.currentMatchCursor]}
				setIsCalendarOpen={calendar.setOpen}
			/>
		</div>
	)
}

'use client'

import { ChatMode } from '@/@types/ChatMode'
import { cn } from '@/lib/utils'
import React, { Dispatch, SetStateAction } from 'react'

import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/button'
import { useMessageController } from '@/hooks/message/useMessagesController'
import { ChatVirtuoso } from './ChatVirtuoso'
import { ChatCalendar } from './ui/ChatCalendar'
import { ChatSearch } from './ui/ChatSearch'

interface Props {
	className?: string
	searchValue: string
	mode: ChatMode
	setEditedValue: React.Dispatch<React.SetStateAction<string>>
	setMode: Dispatch<SetStateAction<ChatMode>>
}

export const ChatContent: React.FC<Props> = ({ className, mode, searchValue, setEditedValue, setMode }) => {
	const {
		isLoading,
		isError,
		isFetched,

		messages,
		virtuosoData,
		loadOlderMessages,
		virtuosoRef,
		lastReadAt,

		isCalendarOpen,
		setIsCalendarOpen,
		selectedDate,
		handleDateSelect,

		matchedMessageIndexes,
		currentMatchCursor,
		scrollToMatch
	} = useMessageController(mode, searchValue)

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

	if (messages.length === 0 && isFetched) {
		return (
			<div className="h-full w-full grid place-content-center">
				<EmptyState
					title="No messages yet"
					description="Start the conversation by sending a message"
				/>
			</div>
		)
	}

	return (
		<div className={cn('h-full w-full relative', className)}>
			<ChatCalendar
				isCalendarOpen={isCalendarOpen}
				setIsCalendarOpen={setIsCalendarOpen}
				selectedDate={selectedDate}
				handleDateSelect={handleDateSelect}
			/>

			<ChatSearch
				mode={mode}
				matchedMessageIndexes={matchedMessageIndexes}
				currentMatchCursor={currentMatchCursor}
				scrollToMatch={scrollToMatch}
			/>

			<ChatVirtuoso
				mode={mode}
				lastReadAt={lastReadAt}
				setMode={setMode}
				setEditedValue={setEditedValue}
				isLoading={isLoading}
				messages={messages}
				data={virtuosoData}
				virtuosoRef={virtuosoRef}
				loadOlderMessages={loadOlderMessages}
				searchValue={searchValue}
				activeMatchIndex={matchedMessageIndexes[currentMatchCursor]}
				setIsCalendarOpen={setIsCalendarOpen}
			/>
		</div>
	)
}

'use client'

import { ChatMode } from '@/@types/ChatMode'
import { cn } from '@/lib/utils'
import React, { Dispatch, SetStateAction } from 'react'

import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/button'
import { useChatController } from '@/hooks/useMessagesController'
import { ChatCalendar } from './ChatCalendar'
import { ChatSearch } from './ChatSearch'
import { ChatVirtuoso } from './ChatVirtuoso'

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
	} = useChatController(mode, searchValue)

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

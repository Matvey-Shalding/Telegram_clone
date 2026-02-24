'use client'

import React, { Dispatch, SetStateAction } from 'react'
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso'

import { ChatMessage as ChatMessageType, VirtuosoMessage } from '@/@types/ChatMessage'

import { ChatMode } from '@/@types/ChatMode'
import { ChatMessage } from './ChatMessage'
import { ChatMessageSkeleton } from './ChatMessageSkeleton'
import { MessagesScrollbar } from './MessagesScrollbar'

interface Props {
	isLoading: boolean
	messages: ChatMessageType[]
	data: VirtuosoMessage[]
	virtuosoRef: React.RefObject<VirtuosoHandle | null>
	loadOlderMessages: () => void
	searchValue: string
	activeMatchIndex: number | undefined
	setIsCalendarOpen: Dispatch<SetStateAction<boolean>>
	setEditedValue: React.Dispatch<React.SetStateAction<string>>
	setMode: Dispatch<SetStateAction<ChatMode>>
}

export const ChatVirtuoso: React.FC<Props> = ({
	isLoading,
	messages,
	data,
	virtuosoRef,
	loadOlderMessages,
	searchValue,
	activeMatchIndex,
	setIsCalendarOpen,
	setEditedValue,
	setMode
}) => {
	return (
		<Virtuoso<VirtuosoMessage>
			ref={virtuosoRef}
			data={data}
			computeItemKey={(_, item) => item.id}
			startReached={isLoading ? undefined : loadOlderMessages}
			components={{ Scroller: MessagesScrollbar }}
			style={{ height: '100%', width: '100%' }}
			itemContent={(index, item) => {
				/**
				 * 🔹 Skeleton placeholder
				 */
				if ('type' in item && item.type === 'skeleton') {
					return <ChatMessageSkeleton isMine={item.isMine} />
				}

				/**
				 * 🔹 Real chat message
				 */
				const isLastMessage = index === messages.length - 1
				const isActive = activeMatchIndex === index

				return (
					<ChatMessage
						setMode={setMode}
						setEditedValue={setEditedValue}
						key={item.id}
						isLastMessage={isLastMessage}
						message={item as ChatMessageType}
						searchValue={searchValue}
						isActiveMatch={isActive}
						setIsCalendarOpen={setIsCalendarOpen}
					/>
				)
			}}
		/>
	)
}

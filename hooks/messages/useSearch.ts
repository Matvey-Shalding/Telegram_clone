'use client'

import { ChatMessage } from '@/@types/ChatMessage'
import { ChatMode } from '@/@types/ChatMode'
import { Chat } from '@/lib/chat'
import { useLayoutEffect, useMemo, useState } from 'react'

export function useSearch(chat: Chat, messages: ChatMessage[], searchValue: string, mode: ChatMode, virtuosoRef: React.RefObject<any>) {
	const matchedMessageIndexes = useMemo(() => {
		if (!searchValue) return []
		return chat.findSearchMatches(searchValue, messages)
	}, [searchValue, messages, chat])

	const [currentMatchCursor, setCurrentMatchCursor] = useState(0)

	useLayoutEffect(() => {
		if (mode !== 'search' || !virtuosoRef.current || matchedMessageIndexes.length === 0) {
			return
		}

		setCurrentMatchCursor(0)

		virtuosoRef.current.scrollToIndex({
			index: matchedMessageIndexes[0],
			align: 'start',
			behavior: 'smooth'
		})
	}, [mode, matchedMessageIndexes])

	const scrollToMatch = (direction: 'next' | 'prev') => {
		if (!virtuosoRef.current || matchedMessageIndexes.length === 0) return

		setCurrentMatchCursor(prev => {
			const next = direction === 'next' ? Math.min(prev + 1, matchedMessageIndexes.length - 1) : Math.max(prev - 1, 0)

			virtuosoRef.current.scrollToIndex({
				index: matchedMessageIndexes[next],
				align: 'start',
				behavior: 'smooth'
			})

			return next
		})
	}

	return {
		matchedMessageIndexes,
		currentMatchCursor,
		scrollToMatch
	}
}

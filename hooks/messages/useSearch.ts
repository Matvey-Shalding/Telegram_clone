'use client'

import { ChatMessage } from '@/@types/ChatMessage'
import { ChatMode } from '@/@types/ChatMode'
import { Chat } from '@/lib/chat'
import { useLayoutEffect, useMemo, useState } from 'react'
import { VirtuosoHandle } from 'react-virtuoso'

export function useSearch(
	chat: Chat,
	messages: ChatMessage[],
	searchValue: string,
	mode: ChatMode,
	virtuosoRef: React.RefObject<VirtuosoHandle | null>
) {
	/**
	 * 1️⃣ Find matches
	 */
	const matchedMessageIndexes = useMemo(() => {
		if (!searchValue) return []
		return chat.findSearchMatches(searchValue, messages)
	}, [searchValue, messages, chat])

	/**
	 * 2️⃣ Cursor (resets naturally when matches change)
	 */
	const [currentMatchCursor, setCurrentMatchCursor] = useState(0)

	/**
	 * Reset cursor when search results change
	 * (this is a state transition, not an effect)
	 */
	if (currentMatchCursor !== 0 && matchedMessageIndexes.length > 0) {
		// safe because it's guarded and deterministic
		setCurrentMatchCursor(0)
	}

	/**
	 * 3️⃣ Side-effect only: scroll to first match
	 */
	useLayoutEffect(() => {
		if (mode !== 'search' || !virtuosoRef.current || matchedMessageIndexes.length === 0) {
			return
		}

		virtuosoRef.current.scrollToIndex({
			index: matchedMessageIndexes[0],
			align: 'start',
			behavior: 'smooth'
		})
	}, [mode, matchedMessageIndexes, virtuosoRef])

	/**
	 * 4️⃣ Navigate matches
	 */
	const scrollToMatch = (direction: 'next' | 'prev') => {
		if (!virtuosoRef.current || matchedMessageIndexes.length === 0) return

		setCurrentMatchCursor(prev => {
			const next = direction === 'next' ? Math.min(prev + 1, matchedMessageIndexes.length - 1) : Math.max(prev - 1, 0)

			virtuosoRef.current?.scrollToIndex({
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

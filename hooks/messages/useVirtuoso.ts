'use client'

import { ChatMode } from '@/@types/ChatMode'
import { useLayoutEffect, useRef } from 'react'
import { VirtuosoHandle } from 'react-virtuoso'

export function useVirtuoso(messagesLength: number, mode: ChatMode) {
	const virtuosoRef = useRef<VirtuosoHandle | null>(null)

	useLayoutEffect(() => {
		if (mode !== 'default' || !virtuosoRef.current || messagesLength === 0) {
			return
		}

		virtuosoRef.current.scrollToIndex({
			index: messagesLength - 1,
			align: 'end',
			behavior: 'auto'
		})
	}, [mode, messagesLength])

	return { virtuosoRef }
}

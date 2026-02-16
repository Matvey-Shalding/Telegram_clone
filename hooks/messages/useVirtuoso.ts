'use client'

import { ChatMode } from '@/@types/ChatMode'
import { useLayoutEffect, useRef } from 'react'

export function useVirtuoso(messagesLength: number, mode: ChatMode) {
	const virtuosoRef = useRef<any>(null)

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

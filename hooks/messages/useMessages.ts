'use client'

import { ChatMessage } from '@/@types/ChatMessage'
import { Message } from '@/generated/prisma/client'
import { isSameDay as sameDay } from '@/lib/isSameDay'
import { useEffect, useMemo, useState } from 'react'

const WINDOW_SIZE = 200
const WINDOW_INCREMENT = 200

export function useMessages(data: Message[] = []) {
	const [visibleCount, setVisibleCount] = useState(0)

	useEffect(() => {
		if (data.length === 0) return

		setVisibleCount(prev => {
			if (prev === 0) {
				return Math.min(WINDOW_SIZE, data.length)
			}

			if (data.length > prev) {
				return Math.min(data.length, prev + 1)
			}

			return prev
		})
	}, [data.length])

	const visibleMessages = useMemo(() => {
		return data.slice(Math.max(0, data.length - visibleCount))
	}, [data, visibleCount])

	const messages: ChatMessage[] = useMemo(() => {
		return visibleMessages.map((msg, i) => {
			const prev = visibleMessages[i - 1]

			const isSameSender = !!prev && prev.senderId === msg.senderId
			const isSameDay = !!prev && sameDay(new Date(prev.createdAt), new Date(msg.createdAt))

			return {
				...msg,
				isSameSender,
				showDateBadge: !prev || !isSameDay
			}
		})
	}, [visibleMessages])

	const loadOlderMessages = () => {
		if (visibleCount >= data.length) return

		setVisibleCount(prev => Math.min(data.length, prev + WINDOW_INCREMENT))
	}

	return {
		messages,
		loadOlderMessages
	}
}

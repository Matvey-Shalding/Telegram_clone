'use client'

import { ChatMessage } from '@/@types/ChatMessage'
import { Message } from '@/generated/prisma/client'
import { isSameDay } from '@/lib'
import { useEffect, useMemo, useState } from 'react'

const WINDOW_SIZE = 200
const WINDOW_INCREMENT = 200

type MessageLike = Message & {
	clientId?: string
	optimistic?: boolean
}

function normalize(msg: MessageLike): MessageLike {
	return {
		...msg,
		createdAt: new Date(msg.createdAt),
		updatedAt: new Date(msg.updatedAt)
	}
}

export function useMessages(data: MessageLike[] = []) {
	const [visibleCount, setVisibleCount] = useState(0)

	/**
	 * 1️⃣ Normalize + stable sort
	 * Important: optimistic messages must participate in ordering
	 */
	const normalized = useMemo(() => {
		return data.map(normalize).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
	}, [data])

	/**
	 * 2️⃣ Auto-expand window when new messages arrive
	 */
	useEffect(() => {
		if (!normalized.length) return

		setVisibleCount(prev => (prev === 0 ? Math.min(WINDOW_SIZE, normalized.length) : Math.min(normalized.length, prev + 1)))
	}, [normalized.length])

	/**
	 * 3️⃣ Visible slice
	 */
	const visible = useMemo(() => {
		return normalized.slice(Math.max(0, normalized.length - visibleCount))
	}, [normalized, visibleCount])

	/**
	 * 4️⃣ DTO mapping → ChatMessage
	 */
	const messages: ChatMessage[] = useMemo(() => {
		return visible.map((msg, i) => {
			const prev = visible[i - 1]

			return {
				...msg,

				// 👇 UI flags
				optimistic: msg.optimistic === true || (typeof msg.id === 'string' && msg.id.startsWith('temp:')),

				isSameSender: !!prev && prev.senderId === msg.senderId,

				showDateBadge: !prev || !isSameDay(prev.createdAt, msg.createdAt)
			}
		})
	}, [visible])

	/**
	 * 5️⃣ Pagination
	 */
	const loadOlderMessages = () => {
		setVisibleCount(v => Math.min(normalized.length, v + WINDOW_INCREMENT))
	}

	return { messages, loadOlderMessages }
}

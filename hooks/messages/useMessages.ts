'use client'

import { ChatMessage } from '@/@types/ChatMessage'
import { Message } from '@/generated/prisma/client'
import { isSameDay } from '@/lib'
import { useMemo, useState } from 'react'

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
	/**
	 * 1️⃣ Normalize + stable sort
	 */
	const normalized = useMemo(() => {
		return data.map(normalize).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
	}, [data])

	/**
	 * 2️⃣ Visible window size (derived safely)
	 */
	const [visibleCount, setVisibleCount] = useState(() => Math.min(WINDOW_SIZE, normalized.length))

	/**
	 * 3️⃣ Visible slice
	 */
	const visible = useMemo(() => {
		return normalized.slice(Math.max(0, normalized.length - visibleCount))
	}, [normalized, visibleCount])

	/**
	 * 4️⃣ DTO → ChatMessage
	 */
	const messages: ChatMessage[] = useMemo(() => {
		return visible.map((msg, i) => {
			const prev = visible[i - 1]

			return {
				...msg,
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

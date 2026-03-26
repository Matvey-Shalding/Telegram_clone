'use client'

import { ChatMessage, ServerMessage } from '@/@types/Message'
import { Message } from '@/generated/prisma/client'
import { isSameDay } from '@/lib/message.helpers'
import { useEffect, useMemo, useState } from 'react'

const WINDOW_SIZE = 200
const WINDOW_INCREMENT = 200

function normalize(msg: ServerMessage): ServerMessage {
	return {
		...msg,
		createdAt: new Date(msg.createdAt),
		updatedAt: new Date(msg.updatedAt)
	}
}

export function useMessages(data: ServerMessage[] = []) {
	/**
	 * 1️⃣ Normalize + stable sort
	 */
	const normalized = useMemo(() => {
		return data.map(normalize).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
	}, [data])

	/**
	 * 2️⃣ Visible window size
	 * Start with WINDOW_SIZE, expand later if needed
	 */
	const [visibleCount, setVisibleCount] = useState(WINDOW_SIZE)

	/**
	 * 3️⃣ Expand window automatically when new messages arrive
	 * ✅ Safe functional update inside useEffect
	 */
	useEffect(() => {
		setVisibleCount(prev => {
			const next = Math.max(prev, normalized.length)
			return prev === next ? prev : next
		})
	}, [normalized])

	/**
	 * 4️⃣ Visible slice
	 */
	const visible = useMemo(() => {
		return normalized.slice(Math.max(0, normalized.length - visibleCount))
	}, [normalized, visibleCount])

	/**
	 * 5️⃣ DTO → ChatMessage
	 */
	const messages: ChatMessage[] = useMemo(() => {
		return visible.map((msg, i) => {
			const prev = visible[i - 1]

			const maybeClientMsg = msg as Message & { clientId?: string; optimistic?: boolean }

			return {
				...msg,
				optimistic: maybeClientMsg.optimistic === true || (typeof msg.id === 'string' && msg.id.startsWith('temp:')),
				isSameSender: !!prev && prev.senderId === msg.senderId,
				showDateBadge: !prev || !isSameDay(prev.createdAt, msg.createdAt)
			}
		})
	}, [visible])

	/**
	 * 6️⃣ Pagination
	 */
	const loadOlderMessages = () => {
		setVisibleCount(v => Math.min(normalized.length, v + WINDOW_INCREMENT))
	}

	return { messages, loadOlderMessages }
}

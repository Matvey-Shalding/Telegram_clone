'use client'

import { ClientMessage } from '@/@types/ChatMessage'
import { generateId } from '@/lib/generateId'
import { atom, useAtom } from 'jotai'
import { useCallback } from 'react'

type OptMap = Record<string, ClientMessage[]>

const optimisticMessagesAtom = atom<OptMap>({})

/**
 * Shared Jotai-backed optimistic store.
 * conversationId: conversation to operate on (nullable)
 * userId: current user id (nullable) — provided to add() via closure
 */
export function useOptimisticMessages(conversationId: string | null, userId?: string | null) {
	const [optMap, setOptMap] = useAtom(optimisticMessagesAtom)

	const optimistic = conversationId ? (optMap[conversationId] ?? []) : []

	const add = useCallback(
		(content: string, extra?: Partial<ClientMessage>) => {
			if (!conversationId) throw new Error('conversationId is required to add optimistic message')
			if (!userId) throw new Error('userId is required to add optimistic message')

			const clientId = generateId()
			const now = new Date()

			const msg: ClientMessage = {
				id: `optimistic-${clientId}`,
				clientId,
				optimistic: true,
				content,
				conversationId,
				senderId: userId,
				image: null,
				createdAt: now,
				updatedAt: now,
				...extra
			} as ClientMessage

			setOptMap(prev => {
				const prevList = prev[conversationId] ?? []
				return {
					...prev,
					[conversationId]: [...prevList, msg]
				}
			})

			return clientId
		},
		[conversationId, userId, setOptMap]
	)

	const remove = useCallback(
		(clientId: string) => {
			if (!conversationId) return
			setOptMap(prev => {
				const prevList = prev[conversationId] ?? []
				const nextList = prevList.filter(m => m.clientId !== clientId)
				return {
					...prev,
					[conversationId]: nextList
				}
			})
		},
		[conversationId, setOptMap]
	)

	const replace = useCallback(
		(clientId: string, replacement: Partial<ClientMessage>) => {
			if (!conversationId) return
			setOptMap(prev => {
				const prevList = prev[conversationId] ?? []
				const nextList = prevList.map(m => (m.clientId === clientId ? { ...m, ...replacement } : m))
				return {
					...prev,
					[conversationId]: nextList
				}
			})
		},
		[conversationId, setOptMap]
	)

	const reset = useCallback(() => {
		if (!conversationId) return
		setOptMap(prev => {
			const copy = { ...prev }
			delete copy[conversationId]
			return copy
		})
	}, [conversationId, setOptMap])

	return {
		optimistic,
		add, // (content) => clientId
		remove, // (clientId) => void
		replace, // (clientId, partial) => void
		reset
	}
}

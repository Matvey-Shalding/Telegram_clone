export function isSameDay(a: Date, b: Date) {
	return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

import { MessageReaction } from '@/generated/prisma/client'

export type ReactionGroup = {
	emoji: string
	reactions: MessageReaction[]
}

export function groupReactions(reactions: MessageReaction[]): ReactionGroup[] {
	const map = new Map<string, MessageReaction[]>()

	for (const reaction of reactions) {
		if (!map.has(reaction.reaction)) {
			map.set(reaction.reaction, [])
		}

		map.get(reaction.reaction)!.push(reaction)
	}

	return Array.from(map.entries()).map(([emoji, reactions]) => ({
		emoji,
		reactions
	}))
}

export function formatTime(value: unknown): string {
	const date = value instanceof Date ? value : typeof value === 'string' || typeof value === 'number' ? new Date(value) : null

	if (!date || isNaN(date.getTime())) {
		// fallback → client current time
		return new Date().toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit'
		})
	}

	return date.toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit'
	})
}

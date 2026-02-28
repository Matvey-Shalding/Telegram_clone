import { ChatMessage } from '@/@types/ChatMessage'

/**
 * Find all indexes where a date badge should appear
 */
export function getBadgeIndexes(messages: ChatMessage[]): number[] {
	return messages.map((msg, index) => (msg.showDateBadge ? index : null)).filter((i): i is number => i !== null)
}

/**
 * Find closest badge index for a given date
 * (Telegram-style jump-to-date)
 */
export function findClosestIndexByDate(date: Date, messages: ChatMessage[]): number {
	if (!messages.length) return 0

	// Clone date to avoid mutating original
	const targetDay = new Date(date)
	targetDay.setHours(0, 0, 0, 0)

	const badgeIndexes = getBadgeIndexes(messages)
	if (!badgeIndexes.length) return 0

	const badgeDays = badgeIndexes.map(index => {
		const d = new Date(messages[index].createdAt)
		d.setHours(0, 0, 0, 0)
		return d.getTime()
	})

	const targetTime = targetDay.getTime()

	// Exact match
	for (let i = 0; i < badgeDays.length; i++) {
		if (badgeDays[i] === targetTime) return badgeIndexes[i]
	}

	// Closest future
	for (let i = 0; i < badgeDays.length; i++) {
		if (badgeDays[i] > targetTime) return badgeIndexes[i]
	}

	// Fallback: last badge
	return badgeIndexes[badgeIndexes.length - 1]
}

/**
 * Find all message indexes matching a search query
 * (newest → oldest)
 */
export function findSearchMatches(query: string, messages: ChatMessage[]): number[] {
	const q = query.toLowerCase().trim()
	if (!q) return []

	const result: number[] = []

	for (let i = messages.length - 1; i >= 0; i--) {
		const msg = messages[i]
		if (msg.content?.toLowerCase().includes(q)) {
			result.push(i)
		}
	}

	return result
}

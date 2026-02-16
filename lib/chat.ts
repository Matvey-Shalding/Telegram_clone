import { Message } from '@/generated/prisma/client'

export class Chat {
	messages: Message[]

	constructor(messages: Message[]) {
		this.messages = messages
	}

	/**
	 * Find all indexes where a date badge should appear
	 */
	getBadgeIndexes(enhancedMessages: any[]) {
		return enhancedMessages.map((msg, index) => (msg.showDateBadge ? index : null)).filter((i): i is number => i !== null)
	}

	/**
	 * Find closest badge index for a given date
	 * (Telegram-style jump-to-date)
	 */
	findClosestIndexByDate(date: Date, enhancedMessages: any[]) {
		if (!enhancedMessages.length) return 0

		const targetDay = date.setHours(0, 0, 0, 0)

		const badgeIndexes = this.getBadgeIndexes(enhancedMessages)
		if (!badgeIndexes.length) return 0

		const badgeDays = badgeIndexes.map(i => new Date(enhancedMessages[i].createdAt).setHours(0, 0, 0, 0))

		// exact match
		for (let i = 0; i < badgeDays.length; i++) {
			if (badgeDays[i] === targetDay) return badgeIndexes[i]
		}

		// closest future
		for (let i = 0; i < badgeDays.length; i++) {
			if (badgeDays[i] > targetDay) return badgeIndexes[i]
		}

		// fallback: last badge
		return badgeIndexes[badgeIndexes.length - 1]
	}

	/**
	 * Find all message indexes matching a search query
	 * (newest → oldest)
	 */
	findSearchMatches(query: string, enhancedMessages: any[]) {
		const q = query.toLowerCase().trim()
		if (!q) return []

		const result: number[] = []

		for (let i = enhancedMessages.length - 1; i >= 0; i--) {
			const msg = enhancedMessages[i]
			if (msg.content?.toLowerCase().includes(q)) {
				result.push(i)
			}
		}

		return result
	}
}

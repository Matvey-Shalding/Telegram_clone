import { ConversationMember, Conversation as ConversationType, User } from '@/generated/prisma/client'

/**
 * Get conversation title
 */
export function getConversationTitle(
	conversation: ConversationType | null,
	members: (ConversationMember & { user: User })[] | null,
	currentUserId?: string
): string {
	if (!conversation || !members?.length || !currentUserId) return ''

	if (conversation.isGroup) {
		return conversation.title ?? ''
	}

	const otherMember = members.find(m => m.userId !== currentUserId)
	return otherMember?.user?.name ?? ''
}

/**
 * Get conversation details (subtitle)
 */
export function getConversationDetails(conversation: ConversationType | null, members: ConversationMember[] | null): string {
	if (!conversation || !members?.length) return ''

	return conversation.isGroup ? `${members.length} members` : 'last seen recently'
}

/**
 * Format date for chat preview
 */
export function formatConversationDate(date: Date | string | null | undefined): string {
	if (!date) return ''

	const parsed = typeof date === 'string' ? new Date(date) : date
	if (isNaN(parsed.getTime())) return ''

	const now = new Date()

	const isToday = parsed.getDate() === now.getDate() && parsed.getMonth() === now.getMonth() && parsed.getFullYear() === now.getFullYear()

	if (isToday) {
		return parsed.toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit'
		})
	}

	const nowDay = now.getDay() === 0 ? 7 : now.getDay()
	const monday = new Date(now)
	monday.setHours(0, 0, 0, 0)
	monday.setDate(now.getDate() - (nowDay - 1))

	if (parsed >= monday) {
		return parsed.toLocaleDateString('en-US', { weekday: 'short' })
	}

	return parsed.toLocaleDateString('en-US', {
		day: '2-digit',
		month: 'short'
	})
}

/**
 * Get last message description (for preview)
 */
export function getConversationDescription(conversation: ConversationType | null, currentUserId?: string): string {
	if (!conversation) return ''

	const { lastMessagePreview, lastMessageAuthorId, lastMessageAuthorName, isGroup } = conversation

	if (!isGroup) return lastMessagePreview ?? ''
	if (!lastMessagePreview) return ''

	if (lastMessageAuthorId === currentUserId) {
		return `You: ${lastMessagePreview}`
	}

	if (lastMessageAuthorName) {
		return `${lastMessageAuthorName}: ${lastMessagePreview}`
	}

	return lastMessagePreview
}

import { ConversationMember, Conversation as ConversationType, Message, User } from '@/generated/prisma/client'

export class Conversation {
	conversation: ConversationType | null

	constructor(conversation: ConversationType | null) {
		this.conversation = conversation
	}

	getTitle(members: (ConversationMember & { user: User })[] | null, userId: string | undefined) {
		if (!members || members.length === 0 || !this.conversation || !userId) {
			return ''
		}

		if (this.conversation.isGroup) {
			return this.conversation.title ?? ''
		}

		const otherMember = members.find(m => m.userId !== userId)
		return otherMember?.user?.name ?? ''
	}

	getDetails(members: ConversationMember[] | null) {
		if (!members || members.length === 0 || !this.conversation) return ''
		return this.conversation.isGroup ? `${members.length} members` : 'last seen recently'
	}

	getLastMessageContent(messages: Message[] | null) {
		if (!messages || messages.length === 0) return ''
		return messages[messages.length - 1].content
	}
	formatDate(date: Date | string | null | undefined): string {
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

		// Monday as start of week
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
}

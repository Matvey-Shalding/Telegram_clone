
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
}

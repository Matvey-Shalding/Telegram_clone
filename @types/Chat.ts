import { Conversation, ConversationMember, Message, User } from '@/generated/prisma/client'

export interface Chat extends Conversation {
	messages: Message[]
	members: (ConversationMember & { user: User })[]
}

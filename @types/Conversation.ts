import { Conversation, ConversationMember, Message, User } from '@/generated/prisma/client'

export interface ConversationWithMembers extends Conversation {
	members: (ConversationMember & { user: User })[]
	messages: Message[]
}

export interface ConversationWithMessages extends Conversation {
	messages: Message[]
}

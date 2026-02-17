import { Conversation, ConversationMember, User } from '@/generated/prisma/client'

export interface Chat extends Conversation {
	members: (ConversationMember & { user: User })[]
}

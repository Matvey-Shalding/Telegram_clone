import { ConversationMember, User } from '@/generated/prisma/client'

export interface ConversationMemberWithUser extends ConversationMember {
	user: User
}

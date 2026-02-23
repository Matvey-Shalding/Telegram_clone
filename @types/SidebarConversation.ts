import { Conversation, Message } from '@/generated/prisma/client'

export interface SidebarConversation extends Conversation {
	messages: Message[]
}

import { Message } from '@/generated/prisma/client'

export interface ChatMessage extends Message {
	isSameSender: boolean
	showDateBadge: boolean
}

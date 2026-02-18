import { Message } from '@/generated/prisma/client'

export interface ChatMessage extends Message {
	isSameSender: boolean
	showDateBadge: boolean
}

export interface ChatMessageSkeleton {
	id: string
	isMine: boolean
	type: 'skeleton'
}

export type VirtuosoMessage = ChatMessage | ChatMessageSkeleton

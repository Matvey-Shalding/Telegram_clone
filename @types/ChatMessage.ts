import { Message } from '@/generated/prisma/client'

export interface ChatMessage extends ClientMessage {
	isSameSender: boolean
	showDateBadge: boolean
}

export interface ChatMessageSkeleton {
	id: string
	isMine: boolean
	type: 'skeleton'
}

export interface ClientMessage extends Message {
	optimistic?: boolean
	clientId?: string
}

export type VirtuosoMessage = ChatMessage | ChatMessageSkeleton

import { Message, User } from '@/generated/prisma/client'

export interface ChatMessage extends Message {
	isSameSender: boolean
	showDateBadge: boolean
}

export interface ChatMessageSkeleton {
	id: string
	isMine: boolean
	type: 'skeleton'
}

// message received from pusher

export interface PusherMessage extends Message {
	sender: User | null
}

export type VirtuosoMessage = ChatMessage | ChatMessageSkeleton

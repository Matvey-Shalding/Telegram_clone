import { Message, MessageReaction, User } from '@/generated/prisma/client'

// Server / API
export type MessageDTO = Message & { reactions: MessageReaction[]; sender: User }

// Client / UI
export interface ChatMessage extends MessageDTO {
	isSameSender: boolean
	showDateBadge: boolean
	optimistic?: boolean
}

// Skeleton / loading placeholder
export interface ChatMessageSkeleton {
	id: string
	isMine: boolean
	type: 'skeleton'
}

// Realtime message
export type RealtimeMessage = MessageDTO & { sender: User | null }

// Optimistic / temporary message
export type OptimisticMessage = MessageDTO & { clientId: string; optimistic: true }

// Type for rendering in virtualized list
export type VirtuosoMessage = ChatMessage | ChatMessageSkeleton

export type ServerMessage = MessageDTO | OptimisticMessage

export interface PusherMessage extends Message {
	sender: User | null
}

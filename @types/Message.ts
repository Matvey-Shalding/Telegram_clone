import { Message, MessageReaction, User } from '@/generated/prisma/client'

// // message which is passed to ui
// export interface ChatMessage extends DTOMessage {
// 	isSameSender: boolean
// 	showDateBadge: boolean
// 	optimistic?: boolean
// }

// // message skeleton
// export interface ChatMessageSkeleton {
// 	id: string
// 	isMine: boolean
// 	type: 'skeleton'
// }

// // message received from pusher

// export interface PusherMessage extends Message {
// 	sender: User | null
// }

// // message which is passed to virtuoso(either real data or skeletons)
// export type VirtuosoMessage = ChatMessage | ChatMessageSkeleton

// // message received from server
// type DTOMessage = Message & {
// 	reactions: MessageReaction[]
// }

// // message which is stored in react query
// export type ServerMessage = DTOMessage | (DTOMessage & { clientId?: string; optimistic?: boolean })


// Server / API
export type MessageDTO = Message & { reactions: MessageReaction[] }

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

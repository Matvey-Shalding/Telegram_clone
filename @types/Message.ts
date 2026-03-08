import { Message, MessageReaction, User } from '@/generated/prisma/client'

// message which is passed to ui
export interface ChatMessage extends DTOMessage {
	isSameSender: boolean
	showDateBadge: boolean
	optimistic?: boolean
}

// message skeleton
export interface ChatMessageSkeleton {
	id: string
	isMine: boolean
	type: 'skeleton'
}

// message received from pusher

export interface PusherMessage extends Message {
	sender: User | null
}

// message which is passed to virtuoso(either real data or skeletons)
export type VirtuosoMessage = ChatMessage | ChatMessageSkeleton

// message received from server
type DTOMessage = Message & {
	reactions: MessageReaction[]
}

// message which is stored in react query
export type ServerMessage = DTOMessage | (DTOMessage & { clientId?: string; optimistic?: boolean })

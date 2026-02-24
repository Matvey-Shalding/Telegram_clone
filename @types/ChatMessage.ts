import { Message, User } from '@/generated/prisma/client'


// message which is passed to ui
export interface ChatMessage extends Message {
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

// message which is stored in react query
export type ServerMessage = Message | (Message & { clientId?: string; optimistic?: boolean })

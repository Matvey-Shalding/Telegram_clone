import { Message } from '@/generated/prisma/client'
import React from 'react'
interface Props {
	className?: string
	messages: Message[] | null
}
export const ChatContent: React.FC<Props> = ({ className,messages }) => {

	if(!messages) {
		return <div>Chat is empty</div>
	}

	return <div className={className}></div>
}

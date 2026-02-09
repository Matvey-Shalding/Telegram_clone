'use client'

import { Chat as Conversation } from '@/@types/Chat'
import { ChatContent } from './ChatContent'
import { ChatFooter } from './ChatFooter'
import { ChatHeader } from './ChatHeader'

interface Props {
	title: string
	details: string
	conversation: Conversation | null
}

export const Chat: React.FC<Props> = ({ title, details, conversation }) => {
	return (
		<div className="h-screen w-full flex flex-col">
			<ChatHeader
				title={title}
				details={details}
			/>

			<ChatContent messages={conversation?.messages ?? []} />

			<ChatFooter />
		</div>
	)
}

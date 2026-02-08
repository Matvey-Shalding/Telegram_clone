'use client'

import { Chat } from '@/@types/Chat'
import { Virtuoso } from 'react-virtuoso'
import { ChatFooter } from './ChatFooter'
import { ChatHeader } from './ChatHeader'

interface Props {
	title: string
	details: string
	conversation: Chat | null
}

export const Provider: React.FC<Props> = ({ title, details, conversation }) => {
	return (
		<div className="h-screen w-full flex flex-col">
				<ChatHeader
					title={title}
					details={details}
				/>

			{/* SCROLLABLE MESSAGES */}
			<div className="flex-1 min-h-0">
				<Virtuoso
					data={conversation?.messages ?? []}
					className="h-full w-full"
					itemContent={(index, item) => <div className="bg-red-400 text-white h-10">{item.content}</div>}
				/>
			</div>

				<ChatFooter />
		</div>
	)
}

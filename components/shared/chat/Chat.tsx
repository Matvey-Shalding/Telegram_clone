'use client'

import { Chat as Conversation } from '@/@types/Chat'
import { useChatController } from '@/hooks/useChatController'
import { activeUsers } from '@/store/activeUsersAtom'
import { useAtom } from 'jotai'
import { ChatContent } from './ChatContent'
import { ChatFooter } from './ChatFooter'
import { ChatHeader } from './ChatHeader'

interface Props {
	conversation: Conversation | null
}

export const Chat: React.FC<Props> = ({ conversation }) => {
	const { mode, setMode, searchValue, setSearchValue, editedValue, setEditedValue, title, details } = useChatController(conversation)

	const [activeMembers] = useAtom(activeUsers)


	return (
		<div className="h-screen w-full flex flex-col">
			<ChatHeader
				setSearchValue={setSearchValue}
				setMode={setMode}
				mode={mode}
				title={title}
				details={details}
			/>

			<ChatContent
				setMode={setMode}
				setEditedValue={setEditedValue}
				mode={mode}
				searchValue={searchValue}
			/>

			<ChatFooter
				setMode={setMode}
				editedValue={editedValue}
				setEditedValue={setEditedValue}
				mode={mode}
				searchValue={searchValue}
				setSearchValue={setSearchValue}
			/>
		</div>
	)
}

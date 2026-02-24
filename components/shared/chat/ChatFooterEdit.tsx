'use client'

import { ChatMode } from '@/@types/ChatMode'
import { InputGroupAddon, InputGroupInput } from '@/components/ui'
import { Api } from '@/services/clientApi'
import { editedMessageId } from '@/store/editedMessageIdAtom'
import { useAtom } from 'jotai'
import { Check } from 'lucide-react'
import React from 'react'

interface Props {
	editedValue: string
	setEditedValue: React.Dispatch<React.SetStateAction<string>>
	setMode: React.Dispatch<React.SetStateAction<ChatMode>>
}

export const ChatFooterEdit: React.FC<Props> = ({ editedValue, setEditedValue, setMode }) => {
	const [messageId] = useAtom(editedMessageId)

	const onSubmit = async () => {
		if (messageId) {
			setEditedValue('')
			setMode('default')

			try {
				await Api.messages.edit(messageId, editedValue)
			} catch (_error) {}
		}
	}

	return (
		<>
			<InputGroupInput
				value={editedValue}
				onChange={e => setEditedValue(e.target.value)}
				placeholder="Edit..."
				className="outline-none!"
			/>

			<InputGroupAddon align="inline-end">
				<div
					onClick={onSubmit}
					className="size-7 cursor-pointer rounded-full grid place-content-center bg-[#212121]"
				>
					<Check className="text-muted-foreground size-5" />
				</div>
			</InputGroupAddon>
		</>
	)
}

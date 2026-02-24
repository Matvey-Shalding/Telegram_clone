'use client'

import { InputGroupAddon, InputGroupInput } from '@/components/ui'
import { Check } from 'lucide-react'
import React from 'react'

interface Props {
	onSubmit: () => void
	editedValue: string
	setEditedValue: React.Dispatch<React.SetStateAction<string>>
}

export const ChatFooterEdit: React.FC<Props> = ({ onSubmit, editedValue, setEditedValue }) => {
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

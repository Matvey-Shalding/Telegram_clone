'use client'

import { Conversation } from '@/lib/conversation'
import React, { Dispatch, SetStateAction } from 'react'

interface Props {
	className?: string
	date: Date
	setOpen: Dispatch<SetStateAction<boolean>>
}

export const DateBadge: React.FC<Props> = ({ date, setOpen }) => {
	const label = new Conversation(null).formatDate(date)

	return (
		<div
			onClick={() => setOpen(prev => !prev)}
			className="w-full flex justify-center my-4"
		>
			<div className="px-3 py-1 rounded-full text-xs bg-muted text-muted-foreground">{label}</div>
		</div>
	)
}

'use client'

import React, { Dispatch, SetStateAction } from 'react'

interface Props {
	className?: string
	date: Date
	setOpen: Dispatch<SetStateAction<boolean>>
}

export const DateBadge: React.FC<Props> = ({ date, setOpen }) => {
	const label = date.toLocaleDateString(undefined, {
		weekday: 'short',
		day: 'numeric',
		month: 'short'
	})

	return (
		<div
			onClick={() => setOpen(prev => !prev)}
			className="w-full flex justify-center my-4"
		>
			<div className="px-3 py-1 rounded-full text-xs bg-muted text-muted-foreground">{label}</div>
		</div>
	)
}

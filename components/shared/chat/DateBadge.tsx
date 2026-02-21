'use client'

import React, { Dispatch, SetStateAction } from 'react'

interface Props {
	className?: string
	date: Date
	setOpen: Dispatch<SetStateAction<boolean>>
}

export const DateBadge: React.FC<Props> = ({ date, setOpen }) => {
	const isValidDate = date instanceof Date && !isNaN(date.getTime())

	if (!isValidDate) return null

	const label = new Intl.DateTimeFormat('en-US', {
		month: 'long',
		day: 'numeric'
	}).format(date)

	return (
		<div
			onClick={() => setOpen(prev => !prev)}
			className="w-full flex justify-center my-4"
		>
			<div className="px-3.5 py-1.5 rounded-full text-xs bg-muted text-muted-foreground">{label}</div>
		</div>
	)
}

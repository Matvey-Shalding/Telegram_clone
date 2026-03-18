'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import React, { Dispatch, SetStateAction } from 'react'

interface Props {
	className?: string
	date: Date
	setOpen: Dispatch<SetStateAction<boolean>>
}

export const DateBadge: React.FC<Props> = ({ date, setOpen, className }) => {
	const isValidDate = date instanceof Date && !isNaN(date.getTime())
	if (!isValidDate) return null

	const label = new Intl.DateTimeFormat('en-US', {
		month: 'long',
		day: 'numeric'
	}).format(date)

	return (
		<div className="flex justify-center w-full my-4">
			<Button
				type="button"
				variant="secondary"
				size="sm"
				onClick={() => setOpen(prev => !prev)}
				className={cn(
					'h-auto rounded-full px-3.5 py-1.5 text-xs',
					'bg-muted text-muted-foreground',
					'hover:bg-accent hover:text-accent-foreground',
					'active:scale-[0.97] transition-all',
					className
				)}
			>
				{label}
			</Button>
		</div>
	)
}

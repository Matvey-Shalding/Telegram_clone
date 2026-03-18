import { cn } from '@/lib/utils'
import React from 'react'
import { Avatar } from '../shared'

interface Props {
	name: string
	email: string
	avatar: string | null
	onClick?: () => void
	className?: string
}

export const UserItem: React.FC<Props> = ({ name, email, avatar, onClick, className }) => {
	return (
		<button
			onClick={onClick}
			className={cn(
				'flex items-center w-full px-2 py-1 rounded-lg text-left transition-colors',
				'hover:bg-accent hover:text-accent-foreground',
				'active:scale-[0.98]',
				'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
				className
			)}
		>
			<Avatar
				noBadge
				src={avatar ?? undefined}
				className="size-8"
			/>

			<div className="ml-2 flex-1 flex flex-col truncate">
				<span className="font-medium text-sm truncate">{name}</span>
				<span className="text-xs text-muted-foreground truncate">{email}</span>
			</div>
		</button>
	)
}

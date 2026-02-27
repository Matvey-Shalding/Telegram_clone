'use client'

import { Card } from '@/components/ui'
import { ChatMessageActionsDropdown } from './ChatMessageActionsDropdown'
import { ChatMessageStatus } from './ChatMessageStatus'
import { cn } from '@/lib/utils'

interface Props {
	image: string
	isMine: boolean
	isOptimistic: boolean
	time: string
	dropdown: {
		isOpen: boolean
		setIsOpen: (v: boolean) => void
		onDelete: (e: React.MouseEvent) => void
	}
}

export const ChatImageMessage = ({
	image,
	isMine,
	isOptimistic,
	time,
	dropdown
}: Props) => {
	return (
		<div className="flex flex-col gap-1">
			<Card
				onClick={() => !isOptimistic && dropdown.setIsOpen(!dropdown.isOpen)}
				className={cn(
					'relative p-0 overflow-hidden border shadow-none cursor-pointer group',
					isOptimistic && 'opacity-70 border-dashed',
					isMine ? 'bg-primary/5' : 'bg-muted'
				)}
				style={{ width: 260 }}
			>
				<img
					src={image}
					alt="Sent image"
					className="w-[260px] h-[180px] object-cover"
				/>

				{/* Dropdown – delete only */}
				<ChatMessageActionsDropdown
					isMine={isMine}
					isOpen={dropdown.isOpen}
					setIsOpen={dropdown.setIsOpen}
					handleDelete={dropdown.onDelete}
					onlyDelete
				/>
			</Card>

			{/* Bottom meta (time + status) */}
			<div
				className={cn(
					'flex items-center gap-1 text-[11px] px-1',
					isMine
						? 'justify-end text-muted-foreground'
						: 'justify-start text-muted-foreground'
				)}
			>
				<ChatMessageStatus
					time={time}
					isMine={isMine}
					isOptimistic={isOptimistic}
				/>
			</div>
		</div>
	)
}
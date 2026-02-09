'use client'

import { AvatarWithBadge } from '@/components/shared/AvatarWithBadge'
import { Card } from '@/components/ui'
import { Highlight } from '@/components/ui/Highlighted'
import { Message } from '@/generated/prisma/client'
import { useCurrentSession } from '@/hooks/useCurrentSession'
import { cn } from '@/lib/utils'
import { CheckCheck } from 'lucide-react'
import React, { memo } from 'react'

interface Props {
	className?: string
	message: Message
	searchValue: string
	isActiveMatch?: boolean
}

export const ChatMessage: React.FC<Props> = memo(({ className, message, searchValue, isActiveMatch }) => {
	const session = useCurrentSession()
	const isMine = session?.user.id === message.senderId

	return (
		<div className={cn('w-full flex items-end gap-2 px-2', isMine ? 'justify-end' : 'justify-start', className)}>
			{/* Avatar (left) */}
			{!isMine && <AvatarWithBadge className="size-7 shrink-0" />}

			<Card
				className={cn(
					'relative max-w-[70%] px-3 py-1.75 mt-1 text-sm shadow-none border',
					'whitespace-pre-wrap break-words leading-tight',
					isMine ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-muted rounded-bl-sm'
				)}
			>
				{/* Message + inline footer */}
				<div className="flex items-end gap-2">
					<Highlight
						text={message.content ?? ''}
						query={searchValue}
						isActive={isActiveMatch}
						invertColors={!isMine}
					/>

					<span
						className={cn(
							'text-[10px] leading-none whitespace-nowrap flex items-center gap-1 opacity-70',
							isMine ? 'text-primary-foreground' : 'text-muted-foreground'
						)}
					>
						{new Date(message.createdAt).toLocaleTimeString([], {
							hour: '2-digit',
							minute: '2-digit'
						})}

						{/* message status (Telegram-like) */}
						{isMine && <CheckCheck className="size-3" />}
					</span>
				</div>
			</Card>

			{/* Avatar (right) */}
			{isMine && <AvatarWithBadge className="size-7 shrink-0" />}
		</div>
	)
})

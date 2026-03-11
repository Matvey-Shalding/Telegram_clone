'use client'

import { AvatarWithBadge } from '@/components/shared/Avatar'
import { Card } from '@/components/ui'
import { cn } from '@/lib/utils'

interface Props {
	isMine?: boolean
}

export const ChatMessageSkeleton: React.FC<Props> = ({ isMine }) => {
	return (
		<div className={cn('flex flex-col', 'mt-3')}>
			<div className={cn('w-full flex items-end gap-2 px-2', isMine ? 'justify-end' : 'justify-start')}>
				{/* Avatar */}
				{!isMine && <AvatarWithBadge className="size-7 shrink-0 opacity-40" />}

				<Card className={cn('relative max-w-[70%] px-3 py-2 text-sm border', 'bg-muted rounded-lg', 'animate-pulse')}>
					<div className="flex flex-col gap-2">
						{/* Fake text lines */}
						<div className="h-3 w-40 rounded bg-muted-foreground/20" />
						<div className="h-3 w-28 rounded bg-muted-foreground/20" />

						{/* Footer */}
						<div className="h-2 w-12 rounded bg-muted-foreground/20 self-end mt-1" />
					</div>
				</Card>

				{isMine && <AvatarWithBadge className="size-7 shrink-0 opacity-40" />}
			</div>
		</div>
	)
}

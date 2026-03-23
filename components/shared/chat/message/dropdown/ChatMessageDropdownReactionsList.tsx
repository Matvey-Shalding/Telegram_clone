'use client'

import { ReactionWithUser } from '@/@types/ReactionWithUser'
import { Avatar } from '@/components/shared/Avatar'
import { AvatarFallback, AvatarImage, Avatar as ShadAvatar } from '@/components/ui/avatar'
import { DropdownMenuItem, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu'
import { Hand } from 'lucide-react'
import React from 'react'

interface Props {
	className?: string
	reactions: ReactionWithUser[]
}

const formatReactionDate = (date: Date) =>
	new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: '2-digit'
	}).format(new Date(date))

export const ChatMessageDropdownReactionsList: React.FC<Props> = ({ reactions }) => {
	if (reactions.length === 0) return null


	return (
		<DropdownMenuSub>
			<DropdownMenuSubTrigger
				onClick={e => e.stopPropagation()}
				className="flex items-center justify-between px-3 py-1 text-sm"
			>
				<div className="flex items-center gap-2">
					<Hand className="size-4 opacity-80" />
					<span>{reactions.length} Reacted</span>
				</div>

				<div className="flex -space-x-2">
					{reactions.slice(0, 3).map(r => (
						<ShadAvatar
							key={r.id}
							className="size-6 ring-2 ring-background"
						>
							<AvatarImage src={r?.user?.image ?? undefined} />
							<AvatarFallback>{r?.user?.name?.[0]}</AvatarFallback>
						</ShadAvatar>
					))}

					{reactions.length > 3 && (
						<div className="grid size-6 place-content-center rounded-full bg-muted text-xs ring-2 ring-background">
							+{reactions.length - 3}
						</div>
					)}
				</div>
			</DropdownMenuSubTrigger>

			<DropdownMenuSubContent
				sideOffset={10}
				className="p-0"
			>
				<div
					style={{ maxHeight: '250px' }}
					className="overflow-y-auto"
				>
					{reactions.map(reaction => (
						<DropdownMenuItem
							key={reaction.id}
							className="flex transition-all items-center gap-3 px-3 py-1.5 "
						>
							<Avatar
								src={reaction?.user?.image ?? undefined}
								noBadge
								className="size-7"
							/>

							<div className="flex min-w-0 flex-1 flex-col">
								<span className="truncate text-sm font-medium">{reaction.user.name}</span>

								<span className="text-xs text-muted-foreground">{formatReactionDate(reaction.createdAt)}</span>
							</div>

							<span className="text-lg">{reaction.reaction}</span>
						</DropdownMenuItem>
					))}
				</div>
			</DropdownMenuSubContent>
		</DropdownMenuSub>
	)
}

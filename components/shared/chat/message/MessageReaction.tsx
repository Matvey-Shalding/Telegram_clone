'use client'

import { AvatarWithBadge } from '@/components/shared/Avatar'
import { MessageReaction } from '@/generated/prisma/client'
import { groupReactions, ReactionGroup } from '@/lib/message.helpers'
import { motion } from 'framer-motion'

interface Props {
	reactions: MessageReaction[]
}

/**
 * Row that renders reaction pills on the left and the message status (passed as prop) to the right.
 * We only handle the left side here (pills); status will be placed by parent on the right.
 */
export function MessageReactionsRow({ reactions }: Props) {
	const grouped = groupReactions(reactions)

	if (!grouped.length) return null

	return (
		<div className="flex items-center justify-between gap-3 mt-1">
			<div className="flex items-center gap-2">
				{grouped.map(g => (
					<ReactionPill
						key={g.emoji}
						group={g}
					/>
				))}
			</div>

			{/* parent will render ChatMessageStatus to the right */}
			{/* keep a placeholder slot (occupies minimal width) to allow parent to render status on the right */}
			<div className="flex-shrink-0" />
		</div>
	)
}

function ReactionPill({ group }: { group: ReactionGroup }) {
	const count = group.reactions.length
	const single = count === 1

	return (
		<div className="relative">
			<motion.div
				whileTap={{ scale: 0.95 }}
				whileHover={{ scale: 1.04 }}
				className="
          inline-flex items-center gap-1
          px-1.5 min-h-6
          rounded-full
          text-[13px] font-medium
          select-none cursor-pointer
          shadow-sm
          bg-[rgba(255,255,255,0.04)] text-white
          border border-[rgba(255,255,255,0.04)]
        "
			>
				<span className="text-[15px] leading-none">{group.emoji}</span>

				{single ? (
					<div className="w-5 h-5">
						<AvatarWithBadge
							className="size-5"
							noBadge
						/>
					</div>
				) : (
					// </div>
					// show count for multiple reactors
					<span className="rounded-full bg-[#262626] size-5 grid place-content-center text-[12px] font-semibold text-white">{count}</span>
				)}
			</motion.div>
		</div>
	)
}

'use client'

import { AvatarBadge, Avatar as Wrapper } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { CircleUserRound } from 'lucide-react'

interface AvatarProps {
	className?: string
	noBadge?: boolean
	src?: string | null
	groupSrc?: { src?: string | null; name?: string }[]
}

export function Avatar({ className, noBadge, src, groupSrc }: AvatarProps) {
	if (groupSrc && groupSrc.length > 0) {
		const maxVisible = 3
		const visibleMembers = groupSrc.slice(0, maxVisible)
		const extraCount = groupSrc.length - maxVisible

		return (
			<Wrapper className={cn('relative flex items-center justify-center', className)}>
				<div className="w-full h-full relative rounded-full overflow-hidden flex items-center justify-center">
					{visibleMembers.map((member, idx) => {
						const sizeClass = `w-1/2 h-1/2`
						const positionClass = ['absolute', idx === 0 && 'top-0 left-0', idx === 1 && 'top-0 right-0', idx === 2 && 'bottom-0 left-1/4']
							.filter(Boolean)
							.join(' ')

						return member.src ? (
							<img
								key={idx}
								src={member.src}
								alt={member.name || 'Member'}
								className={cn(`${sizeClass} object-cover rounded-full border-2 border-white`, positionClass)}
							/>
						) : (
							<div
								key={idx}
								className={cn(
									`${sizeClass} flex items-center justify-center bg-gray-300 text-xs text-white rounded-full border-2 border-white`,
									positionClass
								)}
							>
								{member.name?.slice(0, 1).toUpperCase() || '?'}
							</div>
						)
					})}

					{extraCount > 0 && (
						<div className="absolute bottom-0 right-0 w-1/2 h-1/2 flex items-center justify-center bg-gray-500 text-white text-xs font-medium rounded-full border-2 border-white">
							+{extraCount}
						</div>
					)}
				</div>
				{!noBadge && <AvatarBadge className="bg-green-600" />}
			</Wrapper>
		)
	}

	return (
		<Wrapper className={className}>
			{src ? (
				<img
					src={src}
					alt="Avatar"
					className={cn('w-full h-full object-cover rounded-full', className)}
				/>
			) : (
				<CircleUserRound className={cn('size-8', className)} />
			)}
			{!noBadge && <AvatarBadge className="bg-green-600" />}
		</Wrapper>
	)
}

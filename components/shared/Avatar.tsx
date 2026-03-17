'use client'

import { AvatarBadge, Avatar as Wrapper } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { CircleUserRound } from 'lucide-react'

interface AvatarProps {
	className?: string
	noBadge?: boolean
	src?: string
}

export function Avatar({ className, noBadge, src }: AvatarProps) {
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

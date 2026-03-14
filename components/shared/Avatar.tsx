import { AvatarBadge, Avatar as Wrapper } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { CircleUserRound } from 'lucide-react'

export function Avatar({ className, noBadge }: { className?: string; noBadge?: boolean }) {
	return (
		<Wrapper>
			<CircleUserRound className={cn('size-8', className)} />
			{!noBadge && <AvatarBadge className="bg-green-600" />}
		</Wrapper>
	)
}

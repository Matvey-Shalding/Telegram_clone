import { Avatar, AvatarBadge } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { CircleUserRound } from 'lucide-react'

export function AvatarWithBadge({ className, noBadge }: { className?: string; noBadge?: boolean }) {
	return (
		<Avatar>
			<CircleUserRound className={cn('size-8', className)} />
			{!noBadge && <AvatarBadge className="bg-green-600" />}
		</Avatar>
	)
}

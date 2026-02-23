import { Avatar, AvatarBadge } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

export function AvatarWithBadge({ className }: { className?: string }) {
	return (
		<Avatar className={cn('size-8', className)}>
			<div className="h-8 w-8 rounded-full bg-red-400" />
			<AvatarBadge className="bg-green-600 dark:bg-green-800" />
		</Avatar>
	)
}

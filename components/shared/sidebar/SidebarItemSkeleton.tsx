'use client'

import { Skeleton } from '@/components/ui/skeleton'

export const SidebarItemSkeleton = () => {
	return (
		<div className="flex items-center gap-x-2 min-h-14 px-2">
			<div
				className="h-8 w-8 shrink-0"
				data-sidebar="icon"
			>
				<Skeleton className="h-full w-full rounded-full" />
			</div>

			<div
				className="flex flex-col gap-y-1 basis-full"
				data-sidebar="label"
			>
				<div className="flex justify-between items-center">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-3 w-10" />
				</div>

				<div className="flex justify-between items-center">
					<Skeleton className="h-3 w-32" />
					<Skeleton className="h-5 w-5 rounded-full" />
				</div>
			</div>
		</div>
	)
}

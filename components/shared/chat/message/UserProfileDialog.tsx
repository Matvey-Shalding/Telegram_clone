'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { User } from '@/generated/prisma/client'
import { activeUsers } from '@/store'
import { useAtom } from 'jotai'
import { Avatar } from '../../Avatar'

export function UserProfileDialog({ user }: { user: User }) {
	const [activeUserIds] = useAtom(activeUsers)

	const status = activeUserIds.includes(user.id) ? 'Online' : 'Last seen recently'

	return (
		<Dialog>
			<DialogTrigger>
				<Avatar
					noBadge
					className="size-7 shrink-0"
				/>
			</DialogTrigger>

			<DialogContent className="max-w-80!">
				<DialogHeader className="border-border border-b pb-3">
					<DialogTitle>User Profile</DialogTitle>
				</DialogHeader>

				<div className="flex flex-col items-center">
					{/* Avatar */}
					<Avatar
						noBadge
						src={user.image}
						size={80}
					/>

					{/* Name */}
					<div className="text-center my-1">
						<p className="text-lg font-semibold">{user.name}</p>
					</div>

					{/* Status */}
					<Badge
						className="mb-3"
						variant="secondary"
					>
						{status}
					</Badge>

					<Separator />

					{/* Email */}
					<div className="flex w-full flex-col gap-1 text-sm mt-3">
						<span className="font-medium">
							<span className="font-bold">Email:</span>
							{user.email}
						</span>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}

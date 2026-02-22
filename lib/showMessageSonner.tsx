'use client'

import { AvatarWithBadge } from '@/components/shared/AvatarWithBadge'
import { X } from 'lucide-react'
import { toast } from 'sonner'

type MessageSonnerPayload = {
	title: string
	isGroup: boolean
	senderName: string
	content?: string | null
	image?: string | null
	createdAt: Date
}

export const showMessageSonner = (data: MessageSonnerPayload) => {
	const time = new Date(data.createdAt).toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit'
	})

	const id = toast(
		<div className="flex gap-3 max-w-xs">
			{/* AVATAR */}
			<AvatarWithBadge className="size-8 shrink-0 opacity-40" />

			<div className="flex w-full flex-col gap-1">
				{/* HEADER — THIS IS THE KEY PART */}
				<div className="flex w-full items-center justify-between">
					<span className="truncate text-sm font-semibold">{data.title}</span>

					<div className="flex items-center gap-2 shrink-0">
						<span className="text-xs text-muted-foreground">{time}</span>

						<button
							onClick={() => toast.dismiss(id)}
							className="text-muted-foreground hover:text-foreground transition"
						>
							<X className="size-4" />
						</button>
					</div>
				</div>

				{/* BODY */}
				{data.content && (
					<p className="truncate text-xs text-muted-foreground">
						{data.isGroup && <span className="font-medium text-foreground">{data.senderName}: </span>}
						{data.content}
					</p>
				)}

				{/* IMAGE */}
				{data.image && (
					<img
						src={data.image}
						alt=""
						className="mt-1 max-w-full rounded-md border"
					/>
				)}
			</div>
		</div>,
		{ duration: 500000 }
	)

	return id
}

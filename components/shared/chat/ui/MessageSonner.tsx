'use client'

import { Avatar } from '@/components/shared/Avatar'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'

type MessageSonnerPayload = {
	title: string
	isGroup: boolean
	senderName: string
	content?: string | null
	image?: string | null
	createdAt: Date | string
}

export const MessageSonner = (data: MessageSonnerPayload) => {
	const time = new Date(data.createdAt).toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit'
	})

	return toast.custom(
		t => (
			<div className="flex w-65 gap-2 rounded-md bg-popover p-3 shadow-md ring-1 ring-border">
				{/* avatar */}
				<Avatar className="size-8 shrink-0" />

				{/* content */}
				<div className="flex min-w-0 flex-1 flex-col">
					{/* header */}
					<div className="flex items-center justify-between gap-2">
						<span className="truncate text-[13px] font-semibold">{data.title}</span>

						<div className="flex items-center gap-x-1.5">
							<span className="shrink-0 text-[11px] text-muted-foreground">{time}</span>
							<button
								onClick={() => toast.dismiss(t.id)}
								className="shrink-0 text-muted-foreground hover:text-foreground transition"
							>
								<X className="size-4" />
							</button>
						</div>
					</div>

					{/* message */}
					<p className="truncate text-[12px] text-muted-foreground">
						{data.isGroup && <span className="font-medium text-foreground">{data.senderName}: </span>}

						{data.content ?? (data.image ? '📷 Photo' : '')}
					</p>
				</div>

				{/* close */}
			</div>
		),
		{
			duration: 5000,
			position: 'bottom-right'
		}
	)
}

'use client'

import { X } from 'lucide-react'
import toast from 'react-hot-toast'

type GroupInvitePayload = {
	title: string // group title
}

export const GroupInviteToast = (data: GroupInvitePayload) => {
	return toast.custom(
		t => (
			<div className="flex w-64 gap-2 rounded-md bg-popover p-3 shadow-md ring-1 ring-border">
				<div className="flex min-w-0 flex-1 flex-col">
					{/* header */}
					<div className="flex items-center justify-between gap-2">
						<span className="truncate text-[13px] font-semibold">You&apos;ve been invited!</span>

						<button
							onClick={() => toast.dismiss(t.id)}
							className="shrink-0 text-muted-foreground hover:text-foreground transition"
						>
							<X className="size-4" />
						</button>
					</div>

					{/* message */}
					<p className="truncate text-[12px] text-muted-foreground mt-1">{`You’ve been invited to the group "${data.title}"`}</p>
				</div>
			</div>
		),
		{
			duration: 5000,
			position: 'bottom-right'
		}
	)
}

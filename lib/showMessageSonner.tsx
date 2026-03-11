import { AvatarWithBadge } from '@/components/shared/Avatar'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'

type MessageSonnerPayload = {
	title: string
	isGroup: boolean
	senderName: string
	content?: string | null
	image?: string | null
	createdAt: Date
}

export const showMessageToast = (data: MessageSonnerPayload) => {
	const time = new Date(data.createdAt).toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit'
	})

	const id = toast.custom(
		<div className="flex w-full max-w-[420px] gap-3 rounded-lg bg-background p-3 shadow-md">
			<AvatarWithBadge className="size-8 shrink-0 opacity-40" />

			<div className="flex min-w-0 w-full flex-col gap-0.5">
				<div className="flex items-center justify-between gap-3">
					<span className="truncate text-sm font-semibold">{data.title}</span>

					<div className="flex items-center gap-2 shrink-0">
						<span className="text-xs text-muted-foreground">{time}</span>

						<button
							type="button"
							onClick={() => toast.dismiss()}
							className="text-muted-foreground hover:text-foreground transition"
						>
							<X className="size-4" />
						</button>
					</div>
				</div>

				{data.content && (
					<p className="truncate text-xs text-muted-foreground">
						{data.isGroup && <span className="font-medium text-foreground">{data.senderName}: </span>}
						{data.content}
					</p>
				)}
			</div>
		</div>,
		{
			duration: 5000,
			position: 'bottom-right'
		}
	)

	return id
}

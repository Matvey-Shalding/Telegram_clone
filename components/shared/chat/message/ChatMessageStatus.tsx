import { CheckCheck, Clock } from 'lucide-react'

interface Props {
	time: string
	isMine: boolean
	isOptimistic: boolean
}

export const ChatMessageStatus = ({ time, isMine, isOptimistic }: Props) => {
	return (
		<div className="flex items-center gap-x-1 shrink-0">
			<span className="text-[10px] opacity-70 leading-none">{time}</span>

			{isMine &&
				(isOptimistic ? (
					<Clock className="size-3 animate-spin-slow opacity-70" />
				) : (
					<CheckCheck className="size-3 opacity-80" />
				))}
		</div>
	)
}
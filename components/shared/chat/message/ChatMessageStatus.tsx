'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Check, CheckCheck, Clock } from 'lucide-react'

interface Props {
	time: string
	isMine: boolean
	isOptimistic: boolean
	wasSeen: boolean
}

export const ChatMessageStatus = ({ time, isMine, isOptimistic, wasSeen }: Props) => {
	return (
		<div className="flex items-center gap-x-1 shrink-0">
			<span className="text-[10px] opacity-70 leading-none">{time}</span>

			{isMine && (
				<AnimatePresence mode="wait">
					{isOptimistic ? (
						<motion.div
							key="clock"
							initial={{ opacity: 0, scale: 0.5 }}
							animate={{ opacity: 0.7, scale: 1 }}
							exit={{ opacity: 0, scale: 0.5 }}
						>
							<Clock className="size-3 animate-spin-slow opacity-70" />
						</motion.div>
					) : wasSeen ? (
						<motion.div
							key="check-check"
							className="text-blue-500"
							initial={{ opacity: 0, scale: 0.5 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.5 }}
						>
							<CheckCheck className="size-3 opacity-80" />
						</motion.div>
					) : (
						<motion.div
							key="single-check"
							className="text-gray-600"
							initial={{ opacity: 0, scale: 0.5 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.5 }}
						>
							<Check className="size-3 opacity-80" />
						</motion.div>
					)}
				</AnimatePresence>
			)}
		</div>
	)
}

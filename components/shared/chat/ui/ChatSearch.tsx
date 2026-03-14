'use client'

import { ChatMode } from '@/@types/ChatMode'
import { cn } from '@/lib/utils'
import { ArrowDown, ArrowUp } from 'lucide-react'
import React from 'react'
interface Props {
	className?: string
	mode: ChatMode
	matchedMessageIndexes: number[]
	currentMatchCursor: number
	scrollToMatch: (direction: 'next' | 'prev') => void
}
export const ChatSearch: React.FC<Props> = ({ className, mode, matchedMessageIndexes, currentMatchCursor, scrollToMatch }) => {
	if (matchedMessageIndexes.length > 0 && mode === 'search') {
		return (
			<div className={cn('absolute right-6 bottom-6 z-30 flex gap-2', className)}>
				<button
					onClick={() => {
						scrollToMatch('prev')
					}}
					disabled={currentMatchCursor === 0}
					className="rounded-full size-8 grid place-items-center bg-black border text-sm disabled:opacity-50"
				>
					<ArrowDown className="size-4" />
				</button>

				<button
					onClick={() => {
						scrollToMatch('next')
					}}
					disabled={currentMatchCursor === matchedMessageIndexes.length - 1}
					className="rounded-full size-8 grid place-items-center bg-black border text-sm disabled:opacity-50"
				>
					<ArrowUp className="size-4" />
				</button>
			</div>
		)
	}
}

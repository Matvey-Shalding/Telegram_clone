'use client'

import { ChevronDown } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { EmojiPicker, EmojiPickerContent } from '@/components/ui/emoji-picker'

interface Props {
	onSelect: (emoji: string) => void
}

export const ChatEmojiPicker: React.FC<Props> = ({ onSelect }) => {
	return (
		<Popover>
			<PopoverTrigger
				onClick={e => e.stopPropagation()}
				data-emoji-popover
				asChild
			>
				<button className="size-6 rounded-full bg-muted flex items-center justify-center hover:bg-accent">
					<ChevronDown className="size-4" />
				</button>
			</PopoverTrigger>

			<PopoverContent
				sideOffset={8}
				alignOffset={-16}
				side="top"
				align="end"
				className="p-0 w-fit border rounded-lg"
			>
				<EmojiPicker
					sticky={false}
					columns={7}
					className="h-70"
					onEmojiSelect={({ emoji }) => onSelect(emoji)}
				>
					<EmojiPickerContent />
				</EmojiPicker>
			</PopoverContent>
		</Popover>
	)
}

'use client'

import { useAddReaction } from '@/hooks/message/actions/useAddReaction'
import toast from 'react-hot-toast'
import { ChatEmojiPicker } from '../../ui/ChatEmojiPicker'

interface Props {
	messageId?: string
	closeDropdown: () => void
}

export const ChatMessageReactions: React.FC<Props> = ({ messageId, closeDropdown }) => {
	const PREVIEW_EMOJIS = ['👍', '❤️', '😮', '👏', '🔥', '🎉']
	const addReaction = useAddReaction(messageId)

	const handleSelect = async (emoji: string) => {
		closeDropdown()

		try {
			await addReaction(emoji)
		} catch {
			toast.error('Something went wrong')
		}
	}

	return (
		<div className="flex items-center gap-1 px-1">
			{PREVIEW_EMOJIS.map(e => (
				<button
					key={e}
					onClick={() => handleSelect(e)}
					className="
						size-7
						flex items-center justify-center
						rounded-md
						text-base
						transition-all duration-150
						hover:bg-muted/70
						hover:scale-110
						active:scale-95
						focus-visible:outline-none
						focus-visible:ring-2
						focus-visible:ring-primary/40
					"
				>
					<span className="select-none">{e}</span>
				</button>
			))}

			<ChatEmojiPicker onSelect={handleSelect} />
		</div>
	)
}

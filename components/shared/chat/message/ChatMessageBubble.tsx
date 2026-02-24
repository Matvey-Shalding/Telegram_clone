import { Card } from '@/components/ui'
import { Highlight } from '@/components/ui/Highlighted'
import { cn } from '@/lib/utils'
import { ChatMessageActionsDropdown } from './ChatMessageActionsDropdown'
import { ChatMessageStatus } from './ChatMessageStatus'

interface Props {
	content: string
	searchValue: string
	isActiveMatch?: boolean
	isMine: boolean
	isOptimistic: boolean
	time: string
	dropdown: {
		isOpen: boolean
		setIsOpen: (v: boolean) => void
		onEdit: (e: React.MouseEvent) => void
		onDelete: (e: React.MouseEvent) => void
		onCopy: (e: React.MouseEvent) => void
	}
}

export const ChatMessageBubble = ({ content, searchValue, isActiveMatch, isMine, isOptimistic, time, dropdown }: Props) => {
	return (
		<Card
			onClick={() => !isOptimistic && dropdown.setIsOpen(!dropdown.isOpen)}
			className={cn(
				'relative cursor-pointer max-w-[70%] px-3 py-1.75 text-sm border shadow-none whitespace-pre-wrap break-words leading-tight group',
				'rounded-lg',
				isMine ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted text-muted-foreground hover:bg-muted/90',
				isOptimistic && 'opacity-70 border-dashed'
			)}
		>
			<ChatMessageActionsDropdown
				isMine={isMine}
				isOpen={dropdown.isOpen}
				setIsOpen={dropdown.setIsOpen}
				handleEdit={dropdown.onEdit}
				handleDelete={dropdown.onDelete}
				handleCopy={dropdown.onCopy}
			/>

			<div className="flex items-end gap-2">
				<Highlight
					text={content}
					query={searchValue}
					isActive={isActiveMatch}
					invertColors={!isMine}
				/>

				<ChatMessageStatus
					time={time}
					isMine={isMine}
					isOptimistic={isOptimistic}
				/>
			</div>
		</Card>
	)
}

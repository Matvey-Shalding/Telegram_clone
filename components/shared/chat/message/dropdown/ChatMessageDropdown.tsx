'use client'

import { ReactionWithUser } from '@/@types/ReactionWithUser'
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import React from 'react'
import { ChatMessageDropdownActions } from './ChatMessageDropdownActions'
import { ChatMessageDropdownReactionsList } from './ChatMessageDropdownReactionsList'
import { ChatMessageReactionsMenu } from './ChatMessageDropdownReactionsMenu'

interface Props {
	isMine: boolean
	isOpen: boolean
	setIsOpen: (open: boolean) => void
	handleEdit?: (e: React.MouseEvent) => void
	handleDelete: (e: React.MouseEvent) => void
	handleCopy?: (e: React.MouseEvent) => void
	onlyDelete?: boolean
	messageId?: string
	reactions: ReactionWithUser[]
}

export const ChatMessageDropdown: React.FC<Props> = ({
	isMine,
	isOpen,
	setIsOpen,
	handleCopy,
	handleDelete,
	handleEdit,
	onlyDelete = false,
	messageId,
	reactions
}) => {
	return (
		<DropdownMenu
			open={isOpen}
			onOpenChange={setIsOpen}
		>
			<DropdownMenuTrigger asChild>
				<span className="absolute inset-0" />
			</DropdownMenuTrigger>

			<DropdownMenuContent
				side="top"
				align="end"
				sideOffset={10}
				className="w-50 rounded-lg p-1"
			>
				{!isMine && (
					<>
						<ChatMessageReactionsMenu
							messageId={messageId}
							closeDropdown={() => setIsOpen(false)}
						/>
						<DropdownMenuSeparator className="my-1" />
					</>
				)}

				<ChatMessageDropdownReactionsList reactions={reactions} />

				<DropdownMenuSeparator className="my-1" />

				<ChatMessageDropdownActions
					isMine={isMine}
					handleEdit={handleEdit}
					handleDelete={handleDelete}
					handleCopy={handleCopy}
					onlyDelete={onlyDelete}
				/>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

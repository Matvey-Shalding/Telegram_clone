'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import React from 'react'
import { ChatMessageDropdownActions } from './ChatMessageDropdownActions'
import { ChatMessageReactions } from './ChatMessageDropdownReactions'

interface Props {
	isMine: boolean
	isOpen: boolean
	setIsOpen: (open: boolean) => void
	handleEdit?: (e: React.MouseEvent) => void
	handleDelete: (e: React.MouseEvent) => void
	handleCopy?: (e: React.MouseEvent) => void
	onlyDelete?: boolean
	messageId?: string
}

export const ChatMessageDropdown: React.FC<Props> = ({
	isMine,
	isOpen,
	setIsOpen,
	handleCopy,
	handleDelete,
	handleEdit,
	onlyDelete = false,
	messageId
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
						<ChatMessageReactions
							messageId={messageId}
							closeDropdown={() => setIsOpen(false)}
						/>
						<DropdownMenuSeparator className="my-1" />
					</>
				)}

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

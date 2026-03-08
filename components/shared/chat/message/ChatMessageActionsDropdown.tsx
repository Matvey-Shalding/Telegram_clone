'use client'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { ChevronDown, Copy, Edit, Trash } from 'lucide-react'
import React from 'react'

import { EmojiPicker, EmojiPickerContent } from '@/components/ui/emoji-picker'
import { Api } from '@/services/clientApi'
import { currentConversationId } from '@/store'
import { useAtom } from 'jotai'
import toast from 'react-hot-toast'

interface Props {
	isMine: boolean
	isOpen: boolean
	setIsOpen: (open: boolean) => void
	handleEdit?: (e: React.MouseEvent) => void
	handleDelete: (e: React.MouseEvent) => void
	handleCopy?: (e: React.MouseEvent) => void
	onEmojiSelect?: (emoji: string) => void
	onlyDelete?: boolean
	messageId?: string
}

export const ChatMessageActionsDropdown: React.FC<Props> = ({
	isMine,
	isOpen,
	setIsOpen,
	handleCopy,
	handleDelete,
	handleEdit,
	onEmojiSelect,
	onlyDelete = false,
	messageId
}) => {
	const previewEmojis = ['👍', '❤️', '😮', '👏', '🔥', '🎉']

	const [conversationId] = useAtom(currentConversationId)

	const handleSelect = async (emoji: string) => {
		setIsOpen(false)
		try {
			// emoji can only be selected on default message
			await Api.reactions.add(emoji, messageId!, conversationId)
		} catch {
			toast.error('Something went wrong')
		}
	}

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
					<div className="flex items-center gap-1 px-1">
						{previewEmojis.map(e => (
							<button
								onClick={() => handleSelect(e)}
								key={e}
								className="size-6 flex items-center justify-center rounded hover:bg-muted text-base"
							>
								{e}
							</button>
						))}

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
									onEmojiSelect={({ emoji }) => handleSelect(emoji)}
								>
									<EmojiPickerContent />
								</EmojiPicker>
							</PopoverContent>
						</Popover>
					</div>
				)}

				<DropdownMenuSeparator className="my-1" />

				{isMine && (
					<>
						{!onlyDelete && handleEdit && (
							<DropdownMenuItem
								onClick={handleEdit}
								className="px-3 py-2"
							>
								<Edit className="mr-0.5 size-4" />
								Edit
							</DropdownMenuItem>
						)}

						<DropdownMenuItem
							onClick={handleDelete}
							className="px-3 py-2"
						>
							<Trash className="mr-0.5 size-4" />
							Delete
						</DropdownMenuItem>
					</>
				)}

				{!onlyDelete && handleCopy && (
					<DropdownMenuItem
						onClick={handleCopy}
						className="px-3 py-2"
					>
						<Copy className="mr-0.5 size-4" />
						Copy
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

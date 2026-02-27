'use client'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Copy, Edit, Trash } from 'lucide-react'
import React from 'react'

interface Props {
	isMine: boolean
	isOpen: boolean
	setIsOpen: (open: boolean) => void
	handleEdit?: (e: React.MouseEvent) => void
	handleDelete: (e: React.MouseEvent) => void
	handleCopy?: (e: React.MouseEvent) => void
	onlyDelete?: boolean
}

export const ChatMessageActionsDropdown: React.FC<Props> = ({
	isMine,
	isOpen,
	setIsOpen,
	handleCopy,
	handleDelete,
	handleEdit,
	onlyDelete = false
}) => {
	return (
		<DropdownMenu
			open={isOpen}
			onOpenChange={setIsOpen}
		>
			<DropdownMenuTrigger asChild>
				{/* Invisible trigger inside the Card, click handled externally */}
				<span className="absolute inset-0" />
			</DropdownMenuTrigger>

			<DropdownMenuContent
				side="bottom"
				align="start"
				sideOffset={4}
				className="min-w-[160px] rounded-lg"
			>
				<DropdownMenuLabel className="text-sm px-2 py-1">Actions</DropdownMenuLabel>

				<DropdownMenuSeparator />

				{/* Only show edit/delete if it's mine */}
				{isMine && (
					<>
						{!onlyDelete && (
							<DropdownMenuItem onClick={handleEdit}>
								<Edit className="mr-2 size-4" />
								Edit
							</DropdownMenuItem>
						)}
						<DropdownMenuItem onClick={handleDelete}>
							<Trash className="mr-2 size-4" />
							Delete
						</DropdownMenuItem>
					</>
				)}

				{/* Always show copy */}
				{!onlyDelete && (
					<DropdownMenuItem onClick={handleCopy}>
						<Copy className="mr-2 size-4" />
						Copy
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

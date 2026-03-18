'use client'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Copy, Edit, Trash } from 'lucide-react'

interface Props {
	isMine: boolean
	handleEdit?: (e: React.MouseEvent) => void
	handleDelete: (e: React.MouseEvent) => void
	handleCopy?: (e: React.MouseEvent) => void
	onlyDelete?: boolean
}

export const ChatMessageDropdownActions: React.FC<Props> = ({ isMine, handleEdit, handleDelete, handleCopy, onlyDelete }) => {
	return (
		<>
			{isMine && (
				<>
					{!onlyDelete && handleEdit && (
						<DropdownMenuItem
							onClick={handleEdit}
							className="flex items-center gap-2 px-3 py-2 text-sm transition-colors duration-150 hover:bg-muted/70 focus:bg-muted/70"
						>
							<Edit className="size-4 opacity-80" />
							<span>Edit</span>
						</DropdownMenuItem>
					)}

					<DropdownMenuItem
						onClick={handleDelete}
						className="flex items-center gap-2 px-3 py-2 text-sm text-destructive transition-colors duration-150 hover:bg-destructive/10 focus:bg-destructive/10"
					>
						<Trash className="size-4 opacity-80" />
						<span>Delete</span>
					</DropdownMenuItem>
				</>
			)}

			{!onlyDelete && handleCopy && (
				<DropdownMenuItem
					onClick={handleCopy}
					className="flex items-center gap-2 px-3 py-2 text-sm transition-colors duration-150 hover:bg-muted/70 focus:bg-muted/70"
				>
					<Copy className="size-4 opacity-80" />
					<span>Copy</span>
				</DropdownMenuItem>
			)}
		</>
	)
}

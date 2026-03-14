'use client'

import {
	DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import { Copy, Edit, Trash } from 'lucide-react'

interface Props {
	isMine: boolean
	handleEdit?: (e: React.MouseEvent) => void
	handleDelete: (e: React.MouseEvent) => void
	handleCopy?: (e: React.MouseEvent) => void
	onlyDelete?: boolean
}

export const ChatMessageDropdownActions: React.FC<Props> = ({
	isMine,
	handleEdit,
	handleDelete,
	handleCopy,
	onlyDelete
}) => {
	return (
		<>
			{isMine && (
				<>
					{!onlyDelete && handleEdit && (
						<DropdownMenuItem onClick={handleEdit} className="px-3 py-2">
							<Edit className="mr-0.5 size-4" /> Edit
						</DropdownMenuItem>
					)}

					<DropdownMenuItem onClick={handleDelete} className="px-3 py-2">
						<Trash className="mr-0.5 size-4" /> Delete
					</DropdownMenuItem>
				</>
			)}

			{!onlyDelete && handleCopy && (
				<DropdownMenuItem onClick={handleCopy} className="px-3 py-2">
					<Copy className="mr-0.5 size-4" /> Copy
				</DropdownMenuItem>
			)}
		</>
	)
}
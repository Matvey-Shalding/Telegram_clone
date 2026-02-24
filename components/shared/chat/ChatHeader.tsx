import { ChatMode } from '@/@types/ChatMode'
import { Search, X } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'

interface Props {
	details: string
	title: string
	setMode: Dispatch<SetStateAction<ChatMode>>
	mode: ChatMode
	setSearchValue: Dispatch<SetStateAction<string>>
}

export const ChatHeader: React.FC<Props> = ({ details, title, mode, setMode, setSearchValue }) => {
	const handleClick = () => {
		if (mode === 'search') setSearchValue('')
		setMode(prev => (prev === 'default' ? 'search' : 'default'))
	}

	return (
		<div className="border-b border-border bg-[#171717] px-4 h-15.25 shrink-0 w-full flex items-center justify-between">
			<div className="flex flex-col">
				<span className="text-white font-medium">{title}</span>
				<span className="text-xs text-sidebar-ring">{details}</span>
			</div>
			<div
				className="p-2 cursor-pointer"
				onClick={handleClick}
			>
				{mode === 'default' ? <Search className="text-sidebar-ring size-5.5" /> : <X className="text-sidebar-ring size-5.5" />}
			</div>
		</div>
	)
}

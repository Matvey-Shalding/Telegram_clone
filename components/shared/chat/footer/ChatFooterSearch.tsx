'use client'

import { InputGroupAddon, InputGroupInput } from '@/components/ui'
import { Search } from 'lucide-react'
import React from 'react'

interface Props {
	searchValue: string
	setSearchValue: React.Dispatch<React.SetStateAction<string>>
}

export const ChatFooterSearch: React.FC<Props> = ({ searchValue, setSearchValue }) => {
	return (
		<>
			<InputGroupInput
				value={searchValue}
				onChange={e => setSearchValue(e.target.value)}
				placeholder="Search..."
				className="outline-none! pl-1!"
			/>

			<InputGroupAddon className="p-0">
				<Search className="text-muted-foreground size-5.5 cursor-pointer" />
			</InputGroupAddon>
		</>
	)
}

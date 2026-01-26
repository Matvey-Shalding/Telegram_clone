'use client'

import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui'
import { SidebarHeader as Header, SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { Menu, SearchIcon, X } from 'lucide-react'
import React from 'react'
interface Props {
	className?: string
	setSearchValue: React.Dispatch<React.SetStateAction<string>>
	searchValue: string
}
export const SidebarHeader: React.FC<Props> = ({ className, searchValue, setSearchValue }) => {
	const { state } = useSidebar()
	const isCollapsed = state === 'collapsed'
	return (
		<Header className="flex items-center flex-row py-3 px-3 gap-x-3">
			{!isCollapsed && <Menu className="text-muted-foreground min-w-7 size-7 shrink-0" />}

			<InputGroup className="flex-1 overflow-hidden">
				<InputGroupInput
					onChange={e => setSearchValue(e.target.value)}
					value={searchValue}
					placeholder="Search..."
					className={cn(
						'h-9 transition-all duration-300 ease-in-out',
						isCollapsed ? 'opacity-0 w-0 pointer-events-none' : 'opacity-100 w-full'
					)}
				/>

				<InputGroupAddon>
					<SearchIcon />
				</InputGroupAddon>
				<InputGroupAddon align="inline-end">
					<div
						onClick={() => setSearchValue('')}
						className="pl-2 py-1 cursor-pointer"
					>
						<X className="size-4" />
					</div>
				</InputGroupAddon>
			</InputGroup>

			<SidebarTrigger className={cn('size-6 text-muted-foreground', { '-ml-2': isCollapsed })} />
		</Header>
	)
}

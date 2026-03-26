'use client'

import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui'
import { SidebarHeader as Header, SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { Menu, SearchIcon, X } from 'lucide-react'
import React, { useState } from 'react'
import { useMedia } from 'react-use'
import { SidebarMenuDrawer } from './SidebarMenu'
interface Props {
	className?: string
	setSearchValue: React.Dispatch<React.SetStateAction<string>>
	searchValue: string
}
export const SidebarHeader: React.FC<Props> = ({ className, searchValue, setSearchValue }) => {
	const { state } = useSidebar()
	const isCollapsed = state === 'collapsed'

	const [menuOpen, setMenuOpen] = useState(false)

	const showTrigger = useMedia('(min-width: 768px)')

	return (
		<Header className={cn('flex items-center flex-row px-3 gap-x-3 h-15', className)}>
			{!isCollapsed && (
				<Menu
					onClick={() => setMenuOpen(true)}
					className="size-7 text-muted-foreground shrink-0"
					size={18}
				/>
			)}

			<SidebarMenuDrawer
				open={menuOpen}
				onOpenChange={setMenuOpen}
			/>

			<InputGroup className={cn('flex-1 overflow-hidden', isCollapsed && 'w-0 border-none')}>
				<InputGroupInput
					onChange={e => setSearchValue(e.target.value)}
					value={searchValue}
					placeholder="Search..."
					className={cn('h-9')}
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

			{showTrigger && <SidebarTrigger className={cn('size-7 text-muted-foreground', { '-ml-2': isCollapsed })} />}
		</Header>
	)
}

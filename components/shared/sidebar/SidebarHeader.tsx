'use client'

import { Input } from '@/components/ui/input'
import { SidebarHeader as Header, SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { Menu } from 'lucide-react'
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

			<div className="flex-1 overflow-hidden">
				<Input
					onChange={e => setSearchValue(e.target.value)}
					value={searchValue}
					placeholder="Search..."
					className={cn(
						'h-9 transition-all duration-300 ease-in-out',
						isCollapsed ? 'opacity-0 w-0 pointer-events-none' : 'opacity-100 w-full'
					)}
				/>
			</div>

			<SidebarTrigger className={cn('size-6', { '-ml-2': isCollapsed })} />
		</Header>
	)
}

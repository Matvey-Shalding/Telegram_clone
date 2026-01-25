'use client'

import * as React from 'react'

import { Separator } from '@/components/ui/separator'
import { Sidebar, SidebarRail } from '@/components/ui/sidebar'
import { SidebarChats } from './SidebarChats'
import { SidebarFooter } from './SidebarFooter'
import { SidebarHeader } from './SidebarHeader'

export function MainSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const [searchValue, setSearchValue] = React.useState('')

	return (
		<Sidebar
			collapsible="icon"
			{...props}
		>
			<SidebarHeader searchValue={searchValue} setSearchValue={setSearchValue} />
			<Separator />

			<SidebarChats searchValue={searchValue} />

			<SidebarRail />

			<SidebarFooter />
		</Sidebar>
	)
}

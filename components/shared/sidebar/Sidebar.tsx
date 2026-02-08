'use client'

import * as React from 'react'

import { Separator } from '@/components/ui/separator'
import { Sidebar as CoreSidebar, SidebarRail } from '@/components/ui/sidebar'
import { SidebarContent } from './SidebarContent'
import { SidebarFooter, SidebarHeader } from '.'

export function Sidebar({ ...props }: React.ComponentProps<typeof CoreSidebar>) {
	const [searchValue, setSearchValue] = React.useState('')

	return (
		<CoreSidebar
			collapsible="icon"
			{...props}
		>
			<SidebarHeader
				searchValue={searchValue}
				setSearchValue={setSearchValue}
			/>
			<Separator />

			<SidebarContent searchValue={searchValue} />

			<SidebarRail />

			<SidebarFooter />
		</CoreSidebar>
	)
}

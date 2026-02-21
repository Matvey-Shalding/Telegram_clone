'use client'

import * as React from 'react'

import { Separator } from '@/components/ui/separator'
import { Sidebar as CoreSidebar, SidebarRail } from '@/components/ui/sidebar'
import { currentConversationId } from '@/store'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { SidebarFooter, SidebarHeader } from '.'
import { SidebarContent } from './SidebarContent'

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

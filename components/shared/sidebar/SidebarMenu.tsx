'use client'

import { Drawer, DrawerContent } from '@/components/ui/drawer'

import { Separator } from '@/components/ui/separator'

import { authClient } from '@/auth-client'
import { LogOut, X } from 'lucide-react'
import { Avatar } from '../Avatar'
import { SidebarMenuAddConversation } from './SidebarMenuAddConversation'
import { SidebarMenuProfile } from './SidebarMenuProfile'
import { SidebarMenuSearchUsers } from './SidebarMenuSearchUsers'
import { SidebarMenuSettings } from './SidebarMenuSettings'

interface SidebarMenuDrawerProps {
	open: boolean
	onOpenChange: (open: boolean) => void
}

export const SidebarMenuDrawer: React.FC<SidebarMenuDrawerProps> = ({ open, onOpenChange }) => {
	const user = authClient.useSession().data?.user

	return (
		<Drawer
			direction="left"
			open={open}
			onOpenChange={onOpenChange}
		>
			<DrawerContent className="py-3 flex flex-col max-mobile:min-w-full!">
				<button
					key={user?.id}
					className="w-full flex justify-between items-center px-3 py-1 border-b border-border pb-2.5 rounded-none"
				>
					<div className="flex items-center">
						<Avatar
							noBadge
							className="size-8"
						/>

						<div className="ml-2 flex-1 flex flex-col text-left truncate">
							<span className="font-medium text-sm truncate">{user?.name}</span>
							<span className="text-xs text-muted-foreground truncate">{user?.email}</span>
						</div>
					</div>
					<X
						onClick={() => onOpenChange(false)}
						className="size-5 text-muted-foreground"
					></X>
				</button>

				<div className="flex flex-col p-0">
					<SidebarMenuAddConversation />

					<SidebarMenuSearchUsers />

					<Separator className="my-1" />

					<SidebarMenuProfile />

					<Separator className="my-1" />

					<SidebarMenuSettings />

					<Separator className="my-1" />

					<MenuItem
						icon={<LogOut size={18} />}
						label="Log out"
						danger
					/>
				</div>
			</DrawerContent>
		</Drawer>
	)
}

interface MenuItemProps {
	icon: React.ReactNode
	label: string
	danger?: boolean
}

export const MenuItem: React.FC<MenuItemProps> = ({ icon, label, danger }) => {
	return (
		<button
			className={`
        flex items-center gap-3
        px-3 py-2
        rounded-md
        text-sm
        hover:bg-muted
        transition-colors
        ${danger ? 'text-red-500 hover:bg-red-500/10' : ''}
      `}
		>
			{icon}
			{label}
		</button>
	)
}

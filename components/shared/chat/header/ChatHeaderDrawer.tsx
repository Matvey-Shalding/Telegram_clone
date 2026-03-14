'use client'

import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { X } from 'lucide-react'
import { ReactNode } from 'react'
import { ChatHeaderDrawerActions } from './ChatHeaderDrawerActions'
import { ChatHeaderDrawerMembers } from './ChatHeaderDrawerMembers'

interface ChatHeaderDrawerProps {
	title: string
	details: string
	children: ReactNode
}

export const ChatHeaderDrawer: React.FC<ChatHeaderDrawerProps> = ({ title, details, children }) => {
	return (
		<Drawer direction="right">
			<DrawerTrigger asChild>{children}</DrawerTrigger>

			<DrawerContent>
				<DrawerHeader className="flex items-center flex-row justify-between border-b border-border">
					<div className="flex flex-col">
						<DrawerTitle>{title}</DrawerTitle>
						<DrawerDescription>{details}</DrawerDescription>
					</div>

					<DrawerClose>
						<X className="text-sidebar-ring size-4.5" />
					</DrawerClose>
				</DrawerHeader>

				<ChatHeaderDrawerMembers />

				<ChatHeaderDrawerActions />
			</DrawerContent>
		</Drawer>
	)
}

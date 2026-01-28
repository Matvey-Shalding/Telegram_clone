'use client'

import React from 'react'

import { ChevronsUpDown, LogOut } from 'lucide-react'

import { SidebarFooter as Footer } from '@/components/ui/sidebar'

import { authClient } from '@/auth-client'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
interface Props {
	className?: string
}
export const SidebarFooter: React.FC<Props> = ({ className }) => {
	const { isMobile } = useSidebar()

	const router = useRouter()

	const handleLogout = async () => {
		try {
			await authClient.signOut()

			router.push('auth/sign-up')
		} catch (error) {
			console.log(error)
			toast.error('Something went wrong')
		}
	}

	return (
		<Footer>
			<SidebarMenu>
				<SidebarMenuItem>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton
								size="lg"
								className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							>
								<div className="h-8 w-8 rounded-full bg-red-400" />
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">John Doe</span>
									<span className="truncate text-xs">johndoe@gmail.com</span>
								</div>
								<ChevronsUpDown className="ml-auto size-4" />
							</SidebarMenuButton>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
							side={isMobile ? 'bottom' : 'right'}
							align="end"
							sideOffset={4}
						>
							<DropdownMenuLabel className="p-0 font-normal">
								<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
									<div className="h-8 w-8 rounded-full bg-red-400" />
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-medium">John Doe</span>
										<span className="truncate text-xs">johndoe@gmail.com</span>
									</div>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />

							<DropdownMenuItem onClick={handleLogout}>
								<LogOut />
								Log out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</SidebarMenuItem>
			</SidebarMenu>
		</Footer>
	)
}

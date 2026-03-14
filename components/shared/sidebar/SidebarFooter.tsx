'use client'

import { authClient } from '@/auth-client'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { SidebarFooter as Footer, useSidebar } from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { useCurrentSession } from '@/hooks/useCurrentSession'
import { cn } from '@/lib/utils'
import { ChevronsUpDown, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import toast from 'react-hot-toast'
import { Avatar } from '../Avatar'

export const SidebarFooter: React.FC<{ className?: string }> = ({ className }) => {
	const { isMobile } = useSidebar()
	const router = useRouter()
	const session = useCurrentSession()

	const handleLogout = async () => {
		try {
			await authClient.signOut()
			router.push('auth/sign-up')
		} catch (error) {
			console.error(error)
			toast.error('Something went wrong')
		}
	}

	const userName = session?.user.name

	const userEmail = session?.user.email

	const isLoading = !session?.user

	return (
		<Footer className={cn(className, `h-12 border-t flex items-center justify-center p-0`)}>
			<DropdownMenu>
				<DropdownMenuTrigger
					className="rounded-none"
					asChild
				>
					<button className="flex items-center w-full px-2 py-1 rounded-lg data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
						{isLoading ? (
							<Skeleton className="h-8 w-8 rounded-full" />
						) : (
							<Avatar
								noBadge
								className="size-8"
							/>
						)}

						<div className="ml-2 flex-1 flex flex-col text-left truncate">
							{isLoading ? (
								<>
									<Skeleton className="h-4 w-24 mb-1 rounded" />
									<Skeleton className="h-3 w-32 rounded" />
								</>
							) : (
								<>
									<span className="font-medium text-sm truncate">{userName}</span>
									<span className="text-xs text-muted-foreground truncate">{userEmail}</span>
								</>
							)}
						</div>

						<ChevronsUpDown className="ml-auto size-4" />
					</button>
				</DropdownMenuTrigger>

				<DropdownMenuContent
					side={isMobile ? 'bottom' : 'right'}
					align="end"
					sideOffset={4}
					className="min-w-[224px] rounded-lg"
				>
					<DropdownMenuLabel className="p-0">
						<div className="flex items-center gap-2 px-2 py-1.5">
							{isLoading ? (
								<Skeleton className="h-8 w-8 rounded-full" />
							) : (
								<Avatar
									noBadge
									className="size-8"
								/>
							)}
							<div className="flex-1 flex flex-col text-left truncate">
								{isLoading ? (
									<>
										<Skeleton className="h-4 w-24 mb-1 rounded" />
										<Skeleton className="h-3 w-32 rounded" />
									</>
								) : (
									<>
										<span className="font-medium text-sm truncate">{userName}</span>
										<span className="text-xs text-muted-foreground truncate">{userEmail}</span>
									</>
								)}
							</div>
						</div>
					</DropdownMenuLabel>

					<DropdownMenuSeparator />

					<DropdownMenuItem onClick={handleLogout}>
						<LogOut className="mr-2" />
						Log out
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</Footer>
	)
}

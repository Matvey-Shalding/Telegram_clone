'use client'

import { Sidebar } from '@/components/shared'
import { SidebarInset, SidebarProvider } from '@/components/ui'
import { usePathname } from 'next/navigation'
import { useMedia } from 'react-use'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const isDesktop = useMedia('(min-width: 768px)')
	const pathname = usePathname()

	const isChatPage = pathname.startsWith('/chat/')

	return (
		<SidebarProvider>
			{isDesktop && <Sidebar />}

			{isDesktop ? <SidebarInset>{children}</SidebarInset> : isChatPage ? children : <Sidebar />}
		</SidebarProvider>
	)
}

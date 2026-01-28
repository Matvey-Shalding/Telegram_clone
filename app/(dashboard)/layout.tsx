'use client'

import { MainSidebar } from '@/components/shared'
import { SidebarInset, SidebarProvider } from '@/components/ui'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<MainSidebar />

			<SidebarInset>{children}</SidebarInset>
		</SidebarProvider>
	)
}

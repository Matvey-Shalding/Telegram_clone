'use client'

import { Sidebar } from '@/components/shared'
import { SidebarInset, SidebarProvider } from '@/components/ui'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<Sidebar />

			<SidebarInset>{children}</SidebarInset>
		</SidebarProvider>
	)
}

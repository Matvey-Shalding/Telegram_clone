import { MainSidebar } from '@/components/shared'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function Page() {
	return (
			<SidebarInset>
				<main className="grid place-content-center h-screen">
					<h1 className="font-bold py-3 px-3 rounded-md bg-[#171717]">Select a chat to start messaging</h1>
				</main>
			</SidebarInset>
	)
}

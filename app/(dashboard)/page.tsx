'use client'

import { EmptyState } from '@/components/ui/EmptyState'

export default function DashboardPage() {
	return (
		<main className="grid place-content-center h-screen">
			<EmptyState
				title="Select a chat to start messaging"
				description="Your messages will appear here"
			/>
		</main>
	)
}

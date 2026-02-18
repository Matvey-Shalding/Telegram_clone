import { EmptyState } from '@/components/ui/EmptyState'

export default function Page() {
	return (
		<main className="grid place-content-center h-screen">
			<EmptyState
				className="self-stretch min-w-auto"
				title="Select a chat to start messaging"
				description="Your messages will appear here"
			/>
		</main>
	)
}

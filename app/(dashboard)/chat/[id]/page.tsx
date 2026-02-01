import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui'
import { Mic, Paperclip, Smile } from 'lucide-react'

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
	
	const { id } = await params

	
	
	return (
		<div className="h-screen relative w-full flex flex-col">
			{/* header */}

			<div className="sticky  border-b border-border top-0 left-0 bg-[#171717] p-2.5 pl-5 w-full flex justify-between">
				<div className="flex flex-col">
					<span className="text-white font-medium">User name</span>
					<span className="text-xs text-sidebar-ring">last seen recently</span>
				</div>
			</div>

			{/* Scrollable messages */}
			<div className="flex-1 overflow-y-auto">{/* messages go here */}</div>

			{/* footer */}

			<InputGroup className="sticky outline-none! min-h-12 border-b-0 border-r-0 border-l-0 border-t border-border bottom-0 left-0 bg-[#171717] p-2.5 pl-5 w-full rounded-none text-lg font-medium">
				<InputGroupInput
					className="outline-none!"
					placeholder="Write a message..."
				/>

				<InputGroupAddon>
					<Paperclip className="text-muted-foreground size-6 -translate-x-1" />
				</InputGroupAddon>
				<InputGroupAddon
					className="flex items-center gap-x-3"
					align="inline-end"
				>
					<Smile className="text-muted-foreground size-6" />
					<Mic className="text-muted-foreground size-6" />
					{/* <div
						className="pl-2 py-1 cursor-pointer"
					>
						<X className="size-4" />
					</div> */}
				</InputGroupAddon>
			</InputGroup>
		</div>
	)
}

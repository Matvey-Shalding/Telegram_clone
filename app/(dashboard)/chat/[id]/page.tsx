import { ChatFooter } from '@/components/shared/chat/ChatFooter'
import { ChatHeader } from '@/components/shared/chat/ChatHeader'
import { db } from '@/db'
import { conversationMembers, conversations } from '@/db/schema'
import { getConversationDetails } from '@/lib/getConversationDetails'
import { eq } from 'drizzle-orm'

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params

	const conversation = (
		await db
			.select()
			.from(conversations)
			.where(eq(conversations.id, Number(id)))
	).at(0)

	const members = await db
		.select()
		.from(conversationMembers)
		.where(eq(conversationMembers.conversationId, Number(id)))

	const isGroup = members.length > 2

	const { title, details } = await getConversationDetails(isGroup, conversation, members, Number(id))

	return (
		<div className="h-screen relative w-full flex flex-col">
			<ChatHeader
				title={title}
				details={details}
			/>

			{/* Scrollable messages */}
			<div className="flex-1 overflow-y-auto">{/* messages go here */}</div>

			<ChatFooter />
		</div>
	)
}

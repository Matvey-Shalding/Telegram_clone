import { ChatFooter } from '@/components/shared/chat/ChatFooter'
import { ChatHeader } from '@/components/shared/chat/ChatHeader'
import { prisma } from '@/db/prisma'
import { getConversationDetails } from '@/lib/getConversationDetails'

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params

	const conversation = await prisma.conversation.findFirst({
		where: { id: id }
	})

	const members = await prisma.conversationMember.findMany({
		where: { conversationId: id }
	})


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

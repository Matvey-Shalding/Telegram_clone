import { auth } from '@/auth'
import { Chat } from '@/components/shared/chat/Chat'
import { prisma } from '@/db/prisma'
import { Conversation } from '@/lib/conversation'
import { headers } from 'next/headers'

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params

	const conversation = await prisma.conversation.findFirst({
		where: { id: id },
		include: {
			members: {
				include: {
					user: true
				}
			}
		}
	})

	const session = await auth.api.getSession({
		headers: await headers()
	})

	const service = new Conversation(conversation)

	const title = service.getTitle(conversation?.members ?? null, session?.user.id)

	const details = service.getDetails(conversation?.members ?? null)

	return (
		<Chat
			title={title}
			details={details}
			conversation={conversation}
		/>
	)
}

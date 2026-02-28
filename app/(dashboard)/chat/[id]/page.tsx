import { Chat } from '@/components/shared/chat/Chat'
import { prisma } from '@/db/prisma'

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

	return <Chat conversation={conversation} />
}

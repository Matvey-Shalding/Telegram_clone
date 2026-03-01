import { auth } from '@/auth'
import { Chat } from '@/components/shared/chat/Chat'
import { prisma } from '@/db/prisma'
import { headers } from 'next/headers'

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params

	const userId = await auth.api.getSession({ headers: await headers() }).then(res => res?.user?.id)

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

	const conversationMember = await prisma.conversationMember.findFirst({
		where: {
			conversationId: id,
			userId: userId
		}
	})

	return <Chat conversation={conversation} />
}

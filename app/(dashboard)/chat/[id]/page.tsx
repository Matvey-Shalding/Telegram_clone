import { auth } from '@/auth'
import { Provider } from '@/components/shared/chat/Temp'
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
			},
			messages: true
		}
	})

	const session = await auth.api.getSession({
		headers: await headers() // you need to pass the headers object.
	})

	const service = new Conversation(conversation)

	const title = service.getTitle(conversation?.members ?? null, session?.user.id)

	const details = service.getDetails(conversation?.members ?? null)

	return (
		<Provider
			title={title}
			details={details}
			conversation={conversation}
		/>
	)

	// return (
	// 	<div className="h-screen relative w-full flex flex-col">

	// 		<ChatContent messages={conversation?.messages ?? null} />

	// 		<ChatFooter />
	// 	</div>
	// )
}

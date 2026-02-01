import { auth } from '@/auth'
import { db } from '@/db'
import { conversationMembers, conversations } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
	const session = await auth.api.getSession({ headers: await headers() })

	if (!session) {
		return new NextResponse('Unauthorized', { status: 401 })
	}

	try {
		const userId = session.user.id

		const result = await db
			.select({
				conversation: conversations
			})
			.from(conversations)
			.innerJoin(conversationMembers, eq(conversationMembers.conversationId, conversations.id))
			.where(eq(conversationMembers.userId, Number(userId)))

		// result is an array of { conversation: {...} }
		const conversationsList = result.map(r => r.conversation)

		return NextResponse.json(conversationsList)
	} catch (error) {
		console.error('[CONVERSATIONS_GET]', error)
		return new NextResponse('Internal Error', { status: 500 })
	}
}

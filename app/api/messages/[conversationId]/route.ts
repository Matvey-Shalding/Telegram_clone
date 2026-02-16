import { auth } from '@/auth'
import { prisma } from '@/db/prisma'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: Promise<{ conversationId: string }> }) {
	const { conversationId } = await params

	console.log('Fetching messages for conversationId:', conversationId)

	if (!conversationId) {
		return NextResponse.json({ error: 'conversationId is required' }, { status: 400 })
	}

	const session = await auth.api.getSession({ headers: await headers() })
	const userId = session?.user.id

	// User not foundk

	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const messages = await prisma.message.findMany({
		where: { conversationId },
		orderBy: { createdAt: 'asc' }
	})

	console.log(`Found ${messages.length} messages for conversationId: ${conversationId}`)

	return NextResponse.json(messages)
}

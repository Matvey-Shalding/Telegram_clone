import { db } from '@/db'
import { messages } from '@/db/schema'
import { desc, eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
	const chatId = (await req.nextUrl.searchParams.get('id')) ?? ''

	if (!chatId) return NextResponse.json({})

	const lastMessage = await db
		.select()
		.from(messages)
		.where(eq(messages.conversationId, +chatId))
		.orderBy(desc(messages.createdAt))
		.limit(1)

	return NextResponse.json(lastMessage[0] || {})
}

import { prisma } from '@/db/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
	const chatId = (await req.nextUrl.searchParams.get('id')) ?? ''

	if (!chatId) return NextResponse.json({})

	const lastMessage = prisma.message.findMany({
		where: {
			conversationId: chatId
		},
		orderBy: {
			createdAt: 'desc'
		},
		take: 1
	})

	return NextResponse.json(lastMessage)
}

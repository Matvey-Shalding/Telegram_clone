import { prisma } from '@/db/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id: conversationId } = await params

	if (!conversationId) {
		return NextResponse.json({ error: 'conversationId is required' }, { status: 400 })
	}

	const members = await prisma.conversationMember.findMany({
		where: { conversationId },
		include: { user: true }
	})

	return NextResponse.json(members)
}

import { auth } from '@/auth'
import { prisma } from '@/db/prisma'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: Promise<{ conversationId: string }> }) {
	const { conversationId } = await params

	if (!conversationId) {
		return NextResponse.json({ error: 'conversationId is required' }, { status: 400 })
	}

	const userId = await auth.api.getSession({ headers: await headers() }).then(res => res?.user?.id)

	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const member = await prisma.conversationMember.findFirst({
		where: {
			conversationId,
			userId
		}
	})

	return NextResponse.json(member)
}

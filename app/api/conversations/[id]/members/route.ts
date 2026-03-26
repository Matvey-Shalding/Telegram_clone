export const dynamic = 'force-dynamic'

import { auth } from '@/auth'
import { prisma } from '@/db/prisma'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
	console.log('params', await params)

	const { id: conversationId } = await params

	if (!conversationId) {
		return NextResponse.json({ error: 'conversationId is required' }, { status: 400 })
	}

	const userId = await auth.api.getSession({ headers: await headers() }).then(res => res?.user?.id)

	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const members = await prisma.conversationMember.findMany({
		where: {
			conversationId,
			NOT: { userId }
		},
		include: {
			user: true
		}
	})

	return NextResponse.json(members)
}

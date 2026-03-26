export const dynamic = 'force-dynamic'

import { auth } from '@/auth'
import { PUSHER_KEYS } from '@/config'
import { prisma } from '@/db/prisma'
import { pusherServer } from '@/lib/pusher/pusher'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id: conversationId } = await params

	if (!conversationId) {
		return NextResponse.json({ error: 'conversationId is required' }, { status: 400 })
	}

	const userId = await auth.api.getSession({ headers: await headers() }).then(res => res?.user?.id)

	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const members = await prisma.conversationMember.findMany({
		where: { conversationId },
		include: { user: true }
	})

	await prisma.conversation.deleteMany({
		where: {
			id: conversationId
		}
	})

	for (const member of members) {
		pusherServer.trigger(`user-${member.userId}`, PUSHER_KEYS.DELETE_CONVERSATION, {
			conversationId
		})
	}

	return NextResponse.json({ conversationId })
}

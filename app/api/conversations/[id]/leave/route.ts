export const dynamic = 'force-dynamic'

import { auth } from '@/auth'
import { PUSHER_KEYS } from '@/config'
import { prisma } from '@/db/prisma'
import { pusherServer } from '@/lib/pusher/pusher'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id: conversationId } = await params

	if (!conversationId) {
		return NextResponse.json({ error: 'conversationId is required' }, { status: 400 })
	}

	const userId = await auth.api.getSession({ headers: await headers() }).then(res => res?.user?.id)

	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	await prisma.conversationMember.deleteMany({
		where: {
			conversationId,
			userId
		}
	})

	const newMembers = await prisma.conversationMember.findMany({
		where: { conversationId },
		include: { user: true }
	})

	console.log('newMembers', newMembers)

	for (const member of newMembers) {
		pusherServer.trigger(`user-${member.userId}`, PUSHER_KEYS.LEAVE_CONVERSATION, {
			newMembers,
			conversationId
		})
	}

	pusherServer.trigger(`user-${userId}`, PUSHER_KEYS.LEAVE_CONVERSATION, {
		newMembers,
		conversationId,
		isSameUser: true
	})

	return NextResponse.json(newMembers)
}

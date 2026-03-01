'use server'

import { auth } from '@/auth'
import { PUSHER_KEYS } from '@/config/pusherKeys'
import { prisma } from '@/db/prisma'
import { pusherServer } from '@/lib/pusher'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id: conversationId } = await params

	if (!conversationId) {
		return NextResponse.json({ error: 'conversationId is required' }, { status: 400 })
	}

	const session = await auth.api.getSession({ headers: await headers() })
	const userId = session?.user?.id

	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	// Get MAX(lastReadAt) from OTHER members
	const aggregate = await prisma.conversationMember.aggregate({
		where: {
			conversationId,
			NOT: { userId }
		},
		_max: {
			lastReadAt: true
		}
	})

	const lastReadAt = aggregate._max.lastReadAt
	return NextResponse.json({ lastReadAt })
}

// ------------------------------------------------
// POST → mark conversation as read by current user
// ------------------------------------------------
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id: conversationId } = await params

	if (!conversationId) {
		return NextResponse.json({ error: 'conversationId is required' }, { status: 400 })
	}

	const session = await auth.api.getSession({ headers: await headers() })
	const userId = session?.user?.id

	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const lastReadAt = new Date()

	await prisma.conversationMember.update({
		where: {
			conversationId_userId: {
				conversationId,
				userId
			}
		},
		data: {
			lastReadAt
		}
	})

	// Notify all users that i've seen the message

	const conversation = await prisma.conversation.findFirst({
		where: { id: conversationId },
		include: { members: { include: { user: true } } }
	})

	if (conversation?.members) {
		for (const member of conversation.members) {
			if (member.userId !== userId) {
				await pusherServer.trigger(`user-${member.user.id}`, PUSHER_KEYS.NEW_LAST_READ_AT, {
					conversationId,
					lastReadAt
				})
			}
		}
	}

	return NextResponse.json({ success: true })
}

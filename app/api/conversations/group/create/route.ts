export const dynamic = 'force-dynamic'

import { auth } from '@/auth'
import { PUSHER_KEYS } from '@/config'
import { prisma } from '@/db/prisma'
import { User } from '@/generated/prisma/client'
import { pusherServer } from '@/lib/pusher/pusher'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
	// route for creating a group

	const body = (await req.json()) as {
		users: User[]
		name: string
	}

	if (!body) {
		return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
	}

	const { users, name } = body

	if (!users || !name || users.length < 2) {
		return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
	}

	const foundGroup = await prisma.conversation.findFirst({
		where: {
			title: name
		}
	})

	if (foundGroup) {
		return NextResponse.json({ exists: true, message: 'Group already exists' }, { status: 409 })
	}

	const currentUserId = (await auth.api.getSession({ headers: await headers() }))?.user.id

	const currentUser = await prisma.user.findUnique({
		where: { id: currentUserId }
	})

	if (!currentUser) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const allUsers = [...users, { id: currentUser.id }]

	const conversation = await prisma.conversation.create({
		data: {
			title: name,
			isGroup: allUsers.length > 2,
			members: {
				create: allUsers.map(user => ({
					user: { connect: { id: user.id } }
				}))
			}
		},
		include: {
			members: {
				include: {
					user: true
				}
			}
		}
	})

	for (const member of allUsers) {
		pusherServer.trigger(`user-${member.id}`, PUSHER_KEYS.NEW_CONVERSATION, {
			conversation,
			creatorId: currentUserId
		})
	}

	return NextResponse.json(conversation)
}

export const dynamic = 'force-dynamic'

import { auth } from '@/auth'
import { PUSHER_KEYS } from '@/config'
import { prisma } from '@/db/prisma'
import { pusherServer } from '@/lib/pusher/pusher'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
	try {
		const body = await req.json()

		console.log(body)

		const { userId } = body as { userId?: string }

		if (!userId) {
			return NextResponse.json({ error: 'User id is required' }, { status: 400 })
		}

		// session
		const session = await auth.api.getSession({
			headers: await headers()
		})

		const currentUserId = session?.user.id

		if (!currentUserId) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		// prevent self conversation
		if (currentUserId === userId) {
			return NextResponse.json({ error: 'Cannot create conversation with yourself' }, { status: 400 })
		}

		// ensure target user exists
		const targetUser = await prisma.user.findUnique({
			where: { id: userId }
		})

		if (!targetUser) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 })
		}

		// check existing conversation
		const existingConversation = await prisma.conversation.findFirst({
			where: {
				isGroup: false,
				AND: [
					{
						members: {
							some: {
								userId: currentUserId
							}
						}
					},
					{
						members: {
							some: {
								userId: userId
							}
						}
					}
				]
			},
			include: {
				members: {
					include: {
						user: true
					}
				}
			}
		})

		if (existingConversation) {
			return NextResponse.json(existingConversation)
		}

		// create conversation
		const conversation = await prisma.conversation.create({
			data: {
				isGroup: false,
				members: {
					create: [
						{
							user: { connect: { id: currentUserId } }
						},
						{
							user: { connect: { id: userId } }
						}
					]
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

		pusherServer.trigger(`user-${userId}`, PUSHER_KEYS.NEW_DIRECT_CONVERSATION, {
			conversation,
			senderName: session.user.name
		})

		pusherServer.trigger(`user-${currentUserId}`, PUSHER_KEYS.NEW_DIRECT_CONVERSATION, {
			conversation,
			isCreator: true
		})

		return NextResponse.json(conversation)
	} catch (error) {
		console.error(error)

		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

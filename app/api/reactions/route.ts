'use server'

import { auth } from '@/auth'
import { prisma } from '@/db/prisma'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
export async function POST(req: NextRequest) {
	try {
		// 1️⃣ Validate session
		const session = await auth.api.getSession({ headers: await headers() })
		const userId = session?.user?.id

		if (!userId) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		// 2️⃣ Validate request body
		const { content, messageId } = await req.json()

		// 3️⃣ Check if message exists
		const message = await prisma.message.findUnique({
			where: { id: messageId },
			select: { id: true }
		})
		if (!message) {
			return NextResponse.json({ error: 'Message not found' }, { status: 404 })
		}

		// 4️⃣ Optional: prevent duplicate reactions by same user
		const existingReaction = await prisma.messageReaction.findFirst({
			where: {
				messageId,
				userId,
				reaction: content
			}
		})

		if (existingReaction) {
			return NextResponse.json({ error: 'Reaction already exists' }, { status: 409 })
		}

		// 5️⃣ Create reaction
		const newReaction = await prisma.messageReaction.create({
			data: {
				reaction: content,
				messageId,
				userId
			}
		})

		return NextResponse.json({ success: true, reaction: newReaction }, { status: 201 })
	} catch (err) {
		console.error('POST /api/message-reaction error:', err)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

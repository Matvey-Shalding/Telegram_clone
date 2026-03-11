'use server'

import { auth } from '@/auth'
import { pusherServer } from '@/lib/pusher/pusher'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
	try {
		// Parse form data (application/x-www-form-urlencoded)
		const formData = await req.formData()
		const socketId = formData.get('socket_id')?.toString()
		const channel = formData.get('channel_name')?.toString()

		if (!socketId || !channel) {
			return NextResponse.json({ error: 'Missing socket_id or channel_name' }, { status: 400 })
		}

		// Get current user session
		const session = await auth.api.getSession({ headers: req.headers })

		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		// Authorize the channel for presence
		const authResponse = pusherServer.authorizeChannel(socketId, channel, {
			user_id: session.user.id,
			user_info: {
				name: session.user.name,
				avatar: session.user.image || null
			}
		})

		return NextResponse.json(authResponse)
	} catch (err) {
		console.error('[PUSHER ERROR]', err)
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
	}
}

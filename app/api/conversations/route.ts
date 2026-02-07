import { auth } from '@/auth'
import { prisma } from '@/db/prisma'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
	const session = await auth.api.getSession({ headers: await headers() })

	if (!session) {
		return new NextResponse('Unauthorized', { status: 401 })
	}

	try {
		const userId = session.user.id

		const conversations = await prisma.conversation.findMany({
			where: {
				members: {
					some: {
						userId: userId
					}
				}
			}
		})

		return NextResponse.json(conversations)
	} catch (error) {
		console.error('[CONVERSATIONS_GET]', error)
		return new NextResponse('Internal Error', { status: 500 })
	}
}

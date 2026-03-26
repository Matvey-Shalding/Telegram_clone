import { auth } from '@/auth'
import { prisma } from '@/db/prisma'
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

	const member = await prisma.conversationMember.findFirst({
		where: {
			conversationId,
			userId
		}
	})

	if (!member) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	if (!member.lastReadAt) {
		const count = await prisma.message.count({
			where: {
				conversationId,
				NOT: { senderId: userId }
			}
		})

		return NextResponse.json({ count })
	}

	const count = await prisma.message.count({
		where: {
			conversationId,
			NOT: { senderId: userId },
			createdAt: {
				gt: member.lastReadAt
			}
		}
	})

	return NextResponse.json({ count })
}

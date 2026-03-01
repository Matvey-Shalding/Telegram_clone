'use server'

import { auth } from '@/auth'
import { prisma } from '@/db/prisma'
import { headers } from 'next/headers'

export const wasLastMessageSeenByOthers = async (conversationId: string | undefined) => {
	if (!conversationId) return

	const userId = await auth.api.getSession({ headers: await headers() }).then(res => res?.user?.id)

	const lastMessage = await prisma.message.findFirst({
		where: { conversationId, senderId: userId },
		orderBy: { createdAt: 'desc' },
		include: { seenBy: true }
	})

	return lastMessage?.seenBy.some(user => user.id !== userId)
}

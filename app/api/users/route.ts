import { auth } from '@/auth'
import { prisma } from '@/db/prisma'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
	const userId = await auth.api.getSession({ headers: await headers() }).then(res => res?.user?.id)

	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const users = (await prisma.user.findMany())?.filter(user => user.id !== userId)

	return NextResponse.json(users)
}

// src/app/api/users/edit/route.ts
import { auth } from '@/auth'
import { prisma } from '@/db/prisma'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
	try {
		const session = await auth.api.getSession({ headers: await headers() })
		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const userId = session.user.id

		const body = await req.json()
		const { name, email, avatar } = body as { name?: string; email?: string; avatar?: string | undefined }

		if (!name || !email) {
			return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
		}

		// Check uniqueness: is there another user with this email?
		const existing = await prisma.user.findUnique({
			where: { email }
		})

		if (existing && existing.id !== userId) {
			return NextResponse.json({ error: 'Email is already in use by another account' }, { status: 409 })
		}

		const updatedUser = await prisma.user.update({
			where: { id: userId },
			data: {
				name,
				email,
				...(avatar ? { image: avatar } : {})
			}
		})

		return NextResponse.json(updatedUser)
	} catch (err) {
		console.error(err)
		return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
	}
}

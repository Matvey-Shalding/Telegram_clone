import { prisma } from '@/db/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
	const url = new URL(req.url)
	const search = url.searchParams.get('q') || ''

	if (!search) return NextResponse.json([])

	const users = await prisma.user.findMany({
		where: {
			OR: [
				{
					name: {
						contains: search,
						mode: 'insensitive'
					}
				},
				{
					email: {
						contains: search,
						mode: 'insensitive'
					}
				}
			]
		},
		orderBy: {
			name: 'asc'
		},
		take: 20
	})

	return NextResponse.json(users)
}

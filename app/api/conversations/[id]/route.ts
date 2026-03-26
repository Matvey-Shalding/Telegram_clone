import { prisma } from '@/db/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params

	const conversation = await prisma.conversation.findFirst({
		where: {
			id
		},
		include: {
			members: {
				include: {
					user: true
				}
			},
			messages: {
				orderBy: {
					createdAt: 'desc'
				}
			}
		}
	})

	return NextResponse.json(conversation)
}

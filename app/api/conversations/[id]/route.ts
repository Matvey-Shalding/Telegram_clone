import { prisma } from '@/db/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: { id: string } }) {
	const { id } = await params

	const conversation = await prisma.conversation.findFirst({
		where: {
			id: id
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

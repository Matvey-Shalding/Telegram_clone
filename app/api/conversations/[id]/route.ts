import { db } from '@/db'
import { conversations } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: { id: string } }) {
	const { id } = params

	const conversation = await db
		.select()
		.from(conversations)
		.where(eq(conversations.id, Number(id)))

	return NextResponse.json(conversation[0])
}

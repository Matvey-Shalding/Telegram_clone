import { db } from '@/db'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const conversations = await db.query.conversations.findMany()

		return NextResponse.json(conversations)
	} catch (error) {
		console.error("[CONVERSATIONS_GET]", error)
		return NextResponse.error()
	}
}
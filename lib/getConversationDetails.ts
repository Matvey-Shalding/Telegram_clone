import { db } from '@/db'
import { Conversation, ConversationMember, user } from '@/db/schema'
import { eq } from 'drizzle-orm'

export interface ReturnProps {
	title:string,
	details:string
}

export const getConversationDetails = async (
	isGroup: boolean,
	conversation: Conversation | undefined,
	members: ConversationMember[],
	userId: number
):Promise<ReturnProps> => {
	const details = isGroup ? `${members.length} members` : 'last seen recently'

	let title = ''

	if (isGroup) {
		title = conversation?.title ?? ''
	} else {
		const otherMember = members.find(member => member.userId !== userId)
		if (otherMember) {
			const memberName = await db.select().from(user).where(eq(user.id, otherMember.userId))
			title = memberName[0]?.name ?? ''
		}
	}

	return {title,details}
}

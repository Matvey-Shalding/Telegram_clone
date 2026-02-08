import { prisma } from '@/db/prisma'
import { Conversation, ConversationMember } from '@/generated/prisma/client'

export interface ReturnProps {
	title: string
	details: string
}

export const getConversationDetails = async (
	isGroup: boolean,
	members: ConversationMember[],
	userId: string,
	conversation: Conversation | null,
): Promise<ReturnProps> => {
	const details = isGroup ? `${members.length} members` : 'last seen recently'

	let title = ''

	if (isGroup) {
		title = conversation?.title ?? ''
	} else {
		const otherMember = members.find(member => member.userId !== userId)
		if (otherMember) {
			const memberName = await prisma.user.findFirst({
				where: {
					id: otherMember.userId
				}
			})
			title = memberName?.name ?? ''
		}
	}

	return { title, details }
}

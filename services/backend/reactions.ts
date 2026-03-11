import { API_ROUTES } from '@/config/routes'
import { MessageReaction } from '@/generated/prisma/client'
import { axiosInstance } from './instance'

interface Response {
	reaction: MessageReaction
}

export const add = async (content: string, messageId: string, conversationId?: string) => {
	return (
		await axiosInstance.post(`${API_ROUTES.REACTIONS}`, {
			content,
			messageId,
			conversationId
		})
	).data.reaction
}

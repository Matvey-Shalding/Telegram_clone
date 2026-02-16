import { API_ROUTES } from '@/config/routes'
import { axiosInstance } from './instance'

export const send = async ({
	content,
	conversationId,
	optimisticId
}: {
	content: string
	conversationId: string
	optimisticId: string
}) => {
	return (
		await axiosInstance.post(API_ROUTES.MESSAGES + '/send', {
			content,
			conversationId,
			optimisticId
		})
	).data
}

export const getAll = async (conversationId: string) => {
	return (await axiosInstance.get(`${API_ROUTES.MESSAGES}/${conversationId}`)).data
}

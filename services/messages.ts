import { API_ROUTES } from '@/config/routes'
import { axiosInstance } from './instance'

export interface SendMessageRequest {
	content: string
	conversationId: string | undefined
}

export const send = async ({ content, conversationId }: SendMessageRequest) => {
	return (
		await axiosInstance.post(API_ROUTES.MESSAGES + '/send', {
			content,
			conversationId
		})
	).data
}

export const getAll = async (conversationId: string) => {
	return (await axiosInstance.get(`${API_ROUTES.MESSAGES}/${conversationId}`)).data
}

export const remove = async (messageId: string) => {
	await axiosInstance.post(API_ROUTES.MESSAGES + '/delete', {
		messageId
	})
}

export const edit = async (messageId: string, content: string) => {
	await axiosInstance.post(API_ROUTES.MESSAGES + '/edit', {
		messageId,
		content
	})
}

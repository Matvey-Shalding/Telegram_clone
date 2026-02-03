import { API_ROUTES } from '@/config/routes'
import { Conversation, Message } from '@/db/schema'
import { axiosInstance } from './instance'

export const getAll = async (): Promise<Conversation[]> => {
	return (await axiosInstance.get(API_ROUTES.CONVERSATIONS)).data
}

export const get = async (id: string): Promise<Conversation> => {
	console.log('Fetching conversation with id:', id)
	return (await axiosInstance.get(`${API_ROUTES.CONVERSATIONS}/${id}`)).data
}

export const getLastMessage = async (id: number) => {
	return (await axiosInstance.get<Message>(`${API_ROUTES.CONVERSATIONS}/preview`, { params: { id } })).data
}

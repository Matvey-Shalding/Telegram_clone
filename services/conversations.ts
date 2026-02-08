import { Chat } from '@/@types/Chat'
import { API_ROUTES } from '@/config/routes'
import { Message } from '@/generated/prisma/client'
import { axiosInstance } from './instance'

export const getAll = async (): Promise<Chat[]> => {
	return (await axiosInstance.get(API_ROUTES.CONVERSATIONS)).data
}

export const get = async (id: string): Promise<Chat> => {
	return (await axiosInstance.get(`${API_ROUTES.CONVERSATIONS}/${id}`)).data
}

export const getLastMessage = async (id: string) => {
	return (await axiosInstance.get<Message>(`${API_ROUTES.CONVERSATIONS}/preview`, { params: { id } })).data
}

import { Chat } from '@/@types/Chat'
import { API_ROUTES } from '@/config/routes'
import { axiosInstance } from './instance'

export const getAll = async (): Promise<Chat[]> => {
	return (await axiosInstance.get(API_ROUTES.CONVERSATIONS)).data
}

export const get = async (id: string): Promise<Chat> => {
	return (await axiosInstance.get(`${API_ROUTES.CONVERSATIONS}/${id}`)).data
}

export const updateLastReadAt = async (id: string) => {
	await axiosInstance.post(`${API_ROUTES.CONVERSATIONS}/${id}/${API_ROUTES.LAST_READ_AT}`)
}

export const getLastReadAt = async (id: string) => {
	return (await axiosInstance.get(`${API_ROUTES.CONVERSATIONS}/${id}/${API_ROUTES.LAST_READ_AT}`)).data
}

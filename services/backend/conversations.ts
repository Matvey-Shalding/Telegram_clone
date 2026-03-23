import { ConversationWithMembers } from '@/@types/Conversation'
import { ConversationMemberWithUser } from '@/@types/ConversationMemberWithUser'
import { API_ROUTES } from '@/config/routes'
import { User } from '@/generated/prisma/client'
import { axiosInstance } from './instance'

export const getAll = async (): Promise<ConversationWithMembers[]> => {
	return (await axiosInstance.get(API_ROUTES.CONVERSATIONS)).data
}

export const get = async (id: string): Promise<ConversationWithMembers> => {
	return (await axiosInstance.get(`${API_ROUTES.CONVERSATIONS}/${id}`)).data
}

export const updateLastReadAt = async (id: string) => {
	await axiosInstance.post(`${API_ROUTES.CONVERSATIONS}/${id}/${API_ROUTES.LAST_READ_AT}`)
}

export const getLastReadAt = async (id: string) => {
	return (await axiosInstance.get(`${API_ROUTES.CONVERSATIONS}/${id}/${API_ROUTES.LAST_READ_AT}`)).data
}

export const getMembers = async (id: string | undefined): Promise<ConversationMemberWithUser[]> => {
	return (await axiosInstance.get(`${API_ROUTES.CONVERSATIONS}/${id}/members`)).data
}

export const leave = async (id: string | undefined) => {
	await axiosInstance.post(`${API_ROUTES.CONVERSATIONS}/${id}/leave`)
}

export const remove = async (id: string | undefined) => {
	await axiosInstance.post(`${API_ROUTES.CONVERSATIONS}/${id}/delete`)
}

export const createGroup = async (name: string, members: User[]) => {
	await axiosInstance.post(API_ROUTES.CONVERSATIONS + '/group/create', { name, users: members })
}

export const createDirect = async (userId: string) => {
	return (
		await axiosInstance.post(API_ROUTES.CONVERSATIONS + '/direct/create', {
			userId
		})
	).data
}

export interface UnreadCountResponse {
	count: number
}

export const getUnreadCount = async (id: string): Promise<UnreadCountResponse> => {
	return (await axiosInstance.get(`${API_ROUTES.CONVERSATIONS}/${id}/unread-count`)).data
}

import { API_ROUTES } from '@/config'
import { ConversationMember, User } from '@/generated/prisma/client'
import { axiosInstance } from './instance'

export const getAll = async (): Promise<User[]> => {
	return (await axiosInstance.get(API_ROUTES.USERS)).data
}

export const search = async (query: string): Promise<User[]> => {
	return (await axiosInstance.get(API_ROUTES.USERS + `/search?q=${encodeURIComponent(query)}`, { params: { query } })).data
}

export const edit = async (name: string, email: string, avatarUrl?: string) => {
	return (await axiosInstance.post(API_ROUTES.USERS + '/edit', { name, email, avatar: avatarUrl })).data
}

export const getMember = async (conversationId: string): Promise<ConversationMember> => {
	return (await axiosInstance.get(`${API_ROUTES.USERS}/${conversationId}/members`)).data
}

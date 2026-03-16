import { API_ROUTES } from '@/config'
import { User } from '@/generated/prisma/client'
import { axiosInstance } from './instance'

export const getAll = async (): Promise<User[]> => {
	return (await axiosInstance.get(API_ROUTES.USERS)).data
}

export const search = async (query: string): Promise<User[]> => {
	return (await axiosInstance.get(API_ROUTES.USERS + `/search?q=${encodeURIComponent(query)}`, { params: { query } })).data
}

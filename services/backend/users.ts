import { API_ROUTES } from '@/config'
import { axiosInstance } from './instance'
import { User } from '@/generated/prisma/client'

export const getAll = async (): Promise<User[]> => {
	return (await axiosInstance.get(API_ROUTES.USERS)).data
}

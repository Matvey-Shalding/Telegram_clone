import { API_ROUTES } from '@/config/routes'
import { axiosInstance } from './instance'

export const add = async (content:string,messageId:string) => {
	await axiosInstance.post(`${API_ROUTES.REACTIONS}`,{
		content,
		messageId
	})
}
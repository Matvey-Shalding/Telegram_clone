import { createAuthClient } from 'better-auth/react'
import { toast } from 'react-hot-toast'

export const authClient = createAuthClient()

export const signInViaProvider = async (provider: 'github' | 'google') => {
	try {
		await authClient.signIn.social({
			provider: provider
		})
	} catch (error) {
		toast.error('Something went wrong')
	}
}


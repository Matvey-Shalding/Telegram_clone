'use server'

import { auth } from '@/auth'
import { LogInSchema } from '@/components/shared/auth/schemas/logInSchema'

export const signInUser = async (data: LogInSchema) => {
	await auth.api.signInEmail({
		body: {
			email: data.email,
			password: data.password
		}
	})
}

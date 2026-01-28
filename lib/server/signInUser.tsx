'use server'

import { auth } from '@/auth'
import { LogInSchema } from '@/schemas/logInSchema'

export const signInUser = async (data: LogInSchema) => {
	await auth.api.signInEmail({
		body: {
			email: data.email,
			password: data.password
		}
	})
}

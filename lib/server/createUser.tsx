'use server'

import { auth } from '@/auth'
import { SignUpSchema } from '@/components/shared/auth/schemas/signUpSchema'

export async function createUser(data: SignUpSchema) {
	await auth.api.signUpEmail({
		body: {
			email: data.email,
			password: data.password,
			name: data.fullName
		}
	})
}

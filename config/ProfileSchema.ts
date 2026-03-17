import { z } from 'zod'

export const ProfileSchema = z.object({
	name: z.string().trim().min(2, 'Name must be at least 2 characters').max(50, 'Name must be at most 50 characters'),

	email: z.string().trim().email('Invalid email address')
})

export type ProfileSchemaType = z.infer<typeof ProfileSchema>
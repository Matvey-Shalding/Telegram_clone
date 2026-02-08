import { z } from "zod"

export const logInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 6 characters"),
})

export type LogInSchema = z.infer<typeof logInSchema>


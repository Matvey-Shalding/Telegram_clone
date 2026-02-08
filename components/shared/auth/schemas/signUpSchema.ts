import { logInSchema } from './logInSchema'
import { z } from "zod"


export const signUpSchema = logInSchema
  .extend({
    fullName: z
      .string()
      .min(1, "Full name is required")
      .min(6, "Full name must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password")
      .min(8, "Password must be at least 8 characters"),
  })
  .refine(
    data => data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  )

export type SignUpSchema = z.infer<typeof signUpSchema>
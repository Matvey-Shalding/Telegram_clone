'use client'

import { signUpSchema } from '@/components/shared/auth/schemas/signUpSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

import { signInViaProvider } from '@/auth-client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSeparator } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { createUser } from '@/lib/server/createUser'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

type SignUpSchema = z.infer<typeof signUpSchema>

export function SignupForm({ className, ...props }: React.ComponentProps<'div'>) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting }
	} = useForm<SignUpSchema>({
		resolver: zodResolver(signUpSchema),
		mode: 'onSubmit'
	})

	const onSubmit = async (data: SignUpSchema) => {
		try {
			await createUser(data)

			toast.success('User created successfully')
			reset()

			window.location.reload()
		} catch (error: unknown) {
			if (error instanceof Error && error.message.includes('email')) {
				toast.error('Such email is already registered')
			} else {
				toast.error('Something went wrong')
			}
		}
	}

	return (
		<div
			className={cn('flex flex-col overflow-y-scroll mobile:gap-3 sm:gap-4 md:gap-6', className)}
			{...props}
		>
			<Card className="overflow-y-auto p-0 max-sm:rounded-none">
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="p-6 md:p-8 overflow-y-auto"
				>
					<FieldGroup className="md:gap-7 sm:gap-6 mobile:gap-5 gap-4">
						<div className="flex flex-col items-center gap-2 text-center">
							<h1 className="text-2xl font-bold">Create your account</h1>
							<p className="text-muted-foreground text-sm text-balance">Enter your email below to create your account</p>
						</div>

						{/* Full Name */}
						<Field>
							<FieldLabel htmlFor="fullName">Full Name</FieldLabel>
							<Input
								id="fullName"
								type="text"
								placeholder="John Doe"
								{...register('fullName')}
							/>
							<FieldError>{errors.fullName?.message}</FieldError>
						</Field>

						{/* Email */}
						<Field>
							<FieldLabel htmlFor="email">Email</FieldLabel>
							<Input
								id="email"
								type="email"
								placeholder="m@example.com"
								{...register('email')}
							/>
							<FieldDescription>We&apos;ll use this to contact you. We will not share your email with anyone else.</FieldDescription>
							<FieldError>{errors.email?.message}</FieldError>
						</Field>

						{/* Password + Confirm Password */}
						<Field>
							<Field className="grid md:grid-cols-2 mobile:gap-3 gap-2 md:gap-4">
								<Field>
									<FieldLabel htmlFor="password">Password</FieldLabel>
									<Input
										id="password"
										type="password"
										{...register('password')}
									/>
									<FieldError>{errors.password?.message}</FieldError>
								</Field>

								<Field>
									<FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
									<Input
										id="confirmPassword"
										type="password"
										{...register('confirmPassword')}
									/>
									<FieldError>{errors.confirmPassword?.message}</FieldError>
								</Field>
							</Field>

							<FieldDescription>Must be at least 8 characters long.</FieldDescription>
						</Field>

						<Field>
							<Button
								type="submit"
								disabled={isSubmitting}
							>
								<span className="flex items-center gap-2">
									{isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
									<span>{isSubmitting ? 'Creating account…' : 'Create an account'}</span>
								</span>
							</Button>
						</Field>

						<FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">Or continue with</FieldSeparator>

						{/* OAuth */}
						<Field className="grid grid-cols-2 gap-4">
							{/* Google */}
							<Button
								disabled={isSubmitting}
								onClick={() => signInViaProvider('google')}
								variant="outline"
								type="button"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									className="size-5"
								>
									<path
										d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
										fill="currentColor"
									/>
								</svg>
								<span className="sr-only">Sign up with Google</span>
							</Button>

							{/* GitHub */}
							<Button
								disabled={isSubmitting}
								onClick={() => signInViaProvider('github')}
								variant="outline"
								type="button"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									className="size-5"
								>
									<path
										d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
										fill="currentColor"
									/>
								</svg>
							</Button>
						</Field>

						<FieldDescription className="text-center">
							Already have an account? <Link href="/auth/log-in">Log in</Link>
						</FieldDescription>
					</FieldGroup>
				</form>
			</Card>
		</div>
	)
}

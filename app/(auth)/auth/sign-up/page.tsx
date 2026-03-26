import { SignupForm } from '@/components/shared/auth/SignUpForm'

export default function SignUpPage() {
	return (
		<div className="bg-muted flex min-h-svh flex-col items-center justify-center sm:p-6 md:p-10">
			<div className="w-full max-sm:min-w-full sm:max-w-sm md:max-w-md">
				<SignupForm />
			</div>
		</div>
	)
}

import { SignupForm } from '@/components/auth/SignUpForm'
import { LoginForm } from '@/components/shared/LogInForm'

export default function SignUpPage() {
	return (
		<div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm md:max-w-md">
				<LoginForm/>
			</div>
		</div>
	)
}

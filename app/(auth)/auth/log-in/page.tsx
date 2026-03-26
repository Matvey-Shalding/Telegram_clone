import { LoginForm } from '@/components/shared/auth/SignInForm'

export default function SignUpPage() {
	return (
		<div className="bg-muted flex min-h-svh flex-col items-center justify-center sm:p-6 md:p-10">
			<div className="w-full sm-max:min-w-full sm:max-w-sm md:max-w-md">
				<LoginForm />
			</div>
		</div>
	)
}

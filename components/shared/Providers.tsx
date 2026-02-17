import { authClient } from '@/auth-client'
import { currentSession } from '@/store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import React, { useEffect } from 'react'
import { Toaster } from '../ui/sonner'
interface Props {
	className?: string
	children: React.ReactNode
}
export const Providers: React.FC<Props> = ({ className, children }) => {
	const { data } = authClient.useSession()

	const [_, setSession] = useAtom(currentSession)

	const queryClient = new QueryClient()

	useEffect(() => {
		setSession(data)
	}, [data, setSession])

	return (
		<QueryClientProvider client={queryClient}>
			<Toaster />
			{children}
		</QueryClientProvider>
	)
}

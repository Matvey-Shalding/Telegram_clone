import { authClient } from '@/auth-client'
import { queryClient } from '@/lib/reactQuery'
import { sessionAtom } from '@/store/sessionAtom'
import { QueryClientProvider } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import React, { useEffect } from 'react'
import { Toaster } from '../ui/sonner'
interface Props {
	className?: string
	children: React.ReactNode
}
export const Providers: React.FC<Props> = ({ className, children }) => {
	const { data } = authClient.useSession()

	const [_, setSession] = useAtom(sessionAtom)

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

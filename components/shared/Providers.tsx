import { sessionAtom } from '@/atoms/sessionAtom'
import { authClient } from '@/auth-client'
import { queryClient } from '@/lib/reactQuery'
import { QueryClientProvider } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import React, { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
interface Props {
	className?: string
	children: React.ReactNode
}
export const Providers: React.FC<Props> = ({ className, children }) => {
	const { data } = authClient.useSession()

	const [_,setSession] = useAtom(sessionAtom)

	useEffect(() => {
		setSession(data)
	},[data,setSession])

	return (
		<QueryClientProvider client={queryClient}>
			<Toaster />
			{children}
		</QueryClientProvider>
	)
}

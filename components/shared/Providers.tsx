'use client'

import { authClient } from '@/auth-client'
import { currentSession } from '@/store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { Toaster } from '../ui/sonner'

interface Props {
	className?: string
	children: React.ReactNode
}
export const Providers: React.FC<Props> = ({ className, children }) => {
	const { data } = authClient.useSession()

	const [_, setSession] = useAtom(currentSession)

	const [queryClient] = useState(() => new QueryClient())

	useEffect(() => {
		setSession(data)
	}, [data, setSession])

	return (
		<QueryClientProvider client={queryClient}>
			<ReactQueryDevtools initialIsOpen={true} />
			<Toaster />
			{children}
		</QueryClientProvider>
	)
}

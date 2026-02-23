'use client'

import { authClient } from '@/auth-client'
import { currentSession } from '@/store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { PusherProvider } from './PusherProvider'

interface Props {
	children: React.ReactNode
}
export const Providers: React.FC<Props> = ({ children }) => {
	const { data } = authClient.useSession()

	const [, setSession] = useAtom(currentSession)

	const [queryClient] = useState(() => new QueryClient())

	useEffect(() => {
		setSession(data)
	}, [data, setSession])

	return (
		<QueryClientProvider client={queryClient}>
			<PusherProvider />
			<Toaster />
			{children}
		</QueryClientProvider>
	)
}

'use client'

import { authClient } from '@/auth-client'
import { useActiveChannel } from '@/hooks/useActiveChannel'
import { Api } from '@/services/backend/clientApi'
import { currentConversationId, currentSession } from '@/store'
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

	const [conversationId] = useAtom(currentConversationId)

	const [queryClient] = useState(() => new QueryClient())

	useEffect(() => {
		setSession(data)
	}, [data, setSession])

	useEffect(() => {
		const updateLastSeen = async () => {
			if (!conversationId) return
			await Api.conversation.updateLastReadAt(conversationId)
		}
		updateLastSeen()
	}, [conversationId])

	useActiveChannel()

	return (
		<QueryClientProvider client={queryClient}>
			{/* <ReactQueryDevtools initialIsOpen={false} /> */}
			<PusherProvider />
			<Toaster />
			{children}
		</QueryClientProvider>
	)
}

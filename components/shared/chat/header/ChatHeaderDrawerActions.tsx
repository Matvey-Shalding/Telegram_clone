'use client'

import { Button } from '@/components/ui'
import { Spinner } from '@/components/ui/spinner'
import { DrawerFooter } from '@/components/ui/drawer'
import { LogOut, Trash } from 'lucide-react'
import { useAtom } from 'jotai'
import { currentConversationId } from '@/store'
import { useRouter } from 'next/navigation'
import { Api } from '@/services/backend/clientApi'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

export const ChatHeaderDrawerActions = () => {
	const [conversationId] = useAtom(currentConversationId)
	const router = useRouter()

	const leaveMutation = useMutation({
		mutationFn: () => Api.conversation.leave(conversationId),
		onSuccess: () => router.push('/'),
		onError: () => toast.error('Something went wrong')
	})

	const deleteMutation = useMutation({
		mutationFn: () => Api.conversation.remove(conversationId),
		onSuccess: () => router.push('/'),
		onError: () => toast.error('Something went wrong')
	})

	const isLoading = leaveMutation.isPending || deleteMutation.isPending

	return (
		<DrawerFooter className="flex py-3 border-t flex-row gap-x-2.5">
			<Button
				disabled={isLoading}
				onClick={() => leaveMutation.mutate()}
				size="lg"
				variant="outline"
				className="basis-1/2"
			>
				<LogOut className="text-sidebar-ring size-4.5" />
				Leave
				{leaveMutation.isPending && <Spinner data-icon="inline-start" />}
			</Button>

			<Button
				onClick={() => deleteMutation.mutate()}
				disabled={isLoading}
				size="lg"
				variant="destructive"
				className="basis-1/2"
			>
				<Trash className="text-red-400 size-4.5" />
				Delete
				{deleteMutation.isPending && <Spinner data-icon="inline-start" />}
			</Button>
		</DrawerFooter>
	)
}
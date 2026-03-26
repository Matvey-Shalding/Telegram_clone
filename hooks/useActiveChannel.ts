import { pusherClient } from '@/lib/pusher/pusher'
import { activeUsers } from '@/store/activeUsersAtom'
import { useAtom } from 'jotai'
import { Channel } from 'pusher-js'
import { useEffect, useState } from 'react'

export const useActiveChannel = () => {
	const [activeChannel, setActiveChannel] = useState<Channel | null>(null)
	const [, setActiveUsers] = useAtom(activeUsers)

	useEffect(() => {
		let channel = activeChannel

		if (!channel) {
			channel = pusherClient.subscribe('presence-messenger')
			setActiveChannel(channel)
		}

		const isMemberObject = (obj: unknown): obj is { id: string } => {
			return typeof obj === 'object' && obj !== null && 'id' in obj && typeof (obj as any).id === 'string'
		}

		const handleSubscriptionSucceeded = (members: unknown) => {
			const initialMembers: string[] = []

			if (members && typeof (members as any).each === 'function') {
				;(members as any).each((member: unknown) => {
					if (isMemberObject(member)) {
						initialMembers.push(member.id)
					}
				})
			}

			setActiveUsers(initialMembers)
		}

		const handleMemberAdded = (member: unknown) => {
			if (isMemberObject(member)) {
				setActiveUsers(prev => [...prev, member.id])
			}
		}

		const handleMemberRemoved = (member: unknown) => {
			if (isMemberObject(member)) {
				setActiveUsers(prev => prev.filter(id => id !== member.id))
			}
		}

		channel.bind('pusher:subscription_succeeded', handleSubscriptionSucceeded)
		channel.bind('pusher:member_added', handleMemberAdded)
		channel.bind('pusher:member_removed', handleMemberRemoved)

		return () => {
			if (activeChannel) {
				pusherClient.unsubscribe('presence-messenger')
				setActiveChannel(null)
			}
		}
	}, [activeChannel, setActiveUsers])
}

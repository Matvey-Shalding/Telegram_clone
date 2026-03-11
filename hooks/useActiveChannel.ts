import { pusherClient } from '@/lib/pusher/pusher'
import { activeUsers } from '@/store/activeUsersAtom'
import { useAtom } from 'jotai'
import { Channel, Members } from 'pusher-js'
import { useEffect, useState } from 'react'

export const useActiveChannel = () => {
	const [activeChannel, setActiveChannel] = useState<Channel | null>(null)

	const [, setActiveUsers] = useAtom(activeUsers)

	useEffect(() => {
		let channel = activeChannel

		// if there's no channel, we add it

		if (!channel) {
			channel = pusherClient.subscribe('presence-messenger')
			setActiveChannel(channel)
		}

		// initially set active users

		channel.bind('pusher:subscription_succeeded', (members: Members) => {
			const initialMembers: string[] = []

			members.each((member: Record<string, any>) => {
				initialMembers.push(member.id)
			})

			setActiveUsers(initialMembers)
		})

		// when a user connects, update the state

		channel.bind('pusher:member_added', (member: Record<string, any>) => {
			setActiveUsers(prev => [...prev, member.id])
		})

		// when a user disconnects, update the state

		channel.bind('pusher:member_removed', (member: Record<string, any>) => {
			setActiveUsers(prev => prev.filter(id => id !== member.id))
		})

		// clean up on unmount

		return () => {
			if (activeChannel) {
				pusherClient.unsubscribe('presence-messenger')
				setActiveChannel(null)
			}
		}
	}, [activeChannel, setActiveUsers])
}

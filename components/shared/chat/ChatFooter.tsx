'use client'

import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui'
import { generateId } from '@/lib/generateId'
import { Api } from '@/services/clientApi'
import { currentConversationId as conversationAtom } from '@/store/conversationAtom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { Mic, Paperclip, Search, Send, Smile } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'
interface Props {
	className?: string
	mode: 'default' | 'search'
	searchValue: string
	setSearchValue: React.Dispatch<React.SetStateAction<string>>
}
export const ChatFooter: React.FC<Props> = ({ className, mode, searchValue, setSearchValue }) => {
	const [messageInput, setMessageInput] = React.useState('')

	const [currentConversationId] = useAtom(conversationAtom)

	const queryClient = useQueryClient()

	const { mutateAsync } = useMutation({
		mutationFn: Api.messages.send,
		onSuccess: data => {
			console.log('Message sent successfully', data)
			queryClient.invalidateQueries({ queryKey: ['messages'] })
		},
		mutationKey: ['sendMessage']
	})

	const handleSubmit = async () => {
		if (currentConversationId && messageInput.trim().length > 0) {
			try {
				const id = generateId()
				await mutateAsync({ content: messageInput, conversationId: currentConversationId, optimisticId: id })
			} catch (error) {
				toast.error('Something went wrong')
			}
		}
	}

	if (mode === 'default') {
		return (
			<InputGroup
				key="default-input"
				className="sticky shrink-0 outline-none! h-12 border-b-0 border-r-0 border-l-0 border-t border-border bottom-0 left-0 bg-[#171717] p-2.5 pl-5 w-full rounded-none text-lg font-medium"
			>
				<InputGroupInput
					value={messageInput}
					onChange={e => setMessageInput(e.target.value)}
					className="outline-none!"
					placeholder="Write a message..."
				/>

				<InputGroupAddon>
					<Paperclip className="text-muted-foreground size-6 -translate-x-1" />
				</InputGroupAddon>
				<InputGroupAddon
					className="flex items-center gap-x-3"
					align="inline-end"
				>
					{messageInput.length > 0 ? (
						<Send
							onClick={handleSubmit}
							className="text-muted-foreground size-6"
						/>
					) : (
						<>
							<Smile className="text-muted-foreground size-6" />
							<Mic className="text-muted-foreground size-6" />
						</>
					)}
				</InputGroupAddon>
			</InputGroup>
		)
	} else {
		return (
			<InputGroup
				key="search-input"
				className="sticky shrink-0 outline-none! h-12 border-b-0 border-r-0 border-l-0 border-t border-border bottom-0 left-0 bg-[#171717] p-2.5 pl-5 w-full rounded-none text-lg font-medium"
			>
				<InputGroupInput
					value={searchValue}
					onChange={e => setSearchValue(e.target.value)}
					className="outline-none!"
					placeholder="Search..."
				/>

				<InputGroupAddon>
					<Search className="text-muted-foreground size-6 -translate-x-1" />
				</InputGroupAddon>
			</InputGroup>
		)
	}
}

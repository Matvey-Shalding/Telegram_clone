'use client'

import { ChatMode } from '@/@types/ChatMode'
import { Button } from '@/components/ui'
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger
} from '@/components/ui/drawer'
import { Spinner } from '@/components/ui/spinner'
import { REACT_QUERY_KEYS } from '@/config'
import { Api } from '@/services/backend/clientApi'
import { currentConversationId } from '@/store'
import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { useAtom } from 'jotai'
import { EllipsisVertical, LogOut, Search, Trash, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction, useState } from 'react'
import toast from 'react-hot-toast'
import { AvatarWithBadge } from '../Avatar'

interface Props {
	details: string
	title: string
	setMode: Dispatch<SetStateAction<ChatMode>>
	mode: ChatMode
	setSearchValue: Dispatch<SetStateAction<string>>
}

export const ChatHeader: React.FC<Props> = ({ details, title, mode, setMode, setSearchValue }) => {
	const handleClick = () => {
		if (mode === 'search') setSearchValue('')
		setMode(prev => (prev === 'default' ? 'search' : 'default'))
	}

	const [conversationId] = useAtom(currentConversationId)

	const { data: members, isLoading: isDataLoading } = useQuery({
		queryKey: [REACT_QUERY_KEYS.CONVERSATION_MEMBERS, conversationId],
		queryFn: async () => {
			return await Api.conversation.getMembers(conversationId)
		},
		enabled: !!conversationId
	})

	const router = useRouter()

	const [isBusy, setIsBusy] = useState(false)

	const handleLeave = async () => {
		try {
			setIsBusy(true)
			await Api.conversation.leave(conversationId)
			router.push('/')
		} catch (error) {
			toast.error('Something went wrong')
		} finally {
			setIsBusy(false)
		}
	}

	const handleDelete = async () => {
		try {
			setIsBusy(true)
			await Api.conversation.remove(conversationId)
			router.push('/')
		} catch (error) {
			toast.error('Something went wrong')
		} finally {
			setIsBusy(false)
		}
	}

	const isLoading = isDataLoading || isBusy

	return (
		<div className="border-b border-border bg-[#171717] px-4 h-15.25 shrink-0 w-full flex items-center justify-between">
			<div className="flex flex-col">
				<span className="text-white font-medium">{title}</span>
				<span className="text-xs text-sidebar-ring">{details}</span>
			</div>

			<div className="p-2 cursor-pointer relative">
				<AnimatePresence mode="wait">
					{mode === 'default' ? (
						<motion.div
							className="flex items-center gap-x-1"
							key="search"
							initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
							animate={{ rotate: 0, opacity: 1, scale: 1 }}
							exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
							transition={{ duration: 0.2 }}
						>
							<Search
								onClick={handleClick}
								className="text-sidebar-ring size-4.5"
							/>
							<Drawer direction="right">
								<DrawerTrigger>
									<EllipsisVertical className="text-sidebar-ring size-4.5" />
								</DrawerTrigger>
								<DrawerContent>
									<DrawerHeader className="flex items-center flex-row justify-between w-full pb-2 border-b border-border">
										<div className="flex flex-col gap-y-0.5">
											<DrawerTitle>{title}</DrawerTitle>
											<DrawerDescription>{details}</DrawerDescription>
										</div>
										<DrawerClose>
											<X className="text-sidebar-ring size-4.5" />
										</DrawerClose>
									</DrawerHeader>
									<div className="flex flex-col overflow-y-auto py-2 px-2">
										{members?.map(member => (
											<button className="flex items-center w-full px-2 py-1 rounded-lg data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
												<AvatarWithBadge
													noBadge
													className="size-8"
												/>

												<div className="ml-2 flex-1 flex flex-col text-left truncate">
													<span className="font-medium text-sm truncate">{member.user.name}</span>
													<span className="text-xs text-muted-foreground truncate">{member.user.email}</span>
												</div>
											</button>
										))}
									</div>
									<DrawerFooter className="flex py-3 border-t flex-row items-center justify-center gap-x-2.5">
										<Button
											disabled={isLoading}
											onClick={handleLeave}
											size="lg"
											variant="outline"
											className="basis-1/2"
										>
											<LogOut className="text-sidebar-ring size-4.5" />
											Leave
											{isLoading && <Spinner data-icon="inline-start" />}
										</Button>
										<Button
											onClick={handleDelete}
											disabled={isLoading}
											size="lg"
											variant="destructive"
											className="basis-1/2"
										>
											<Trash className="text-red-400 size-4.5" />
											Delete
											{isLoading && <Spinner data-icon="inline-start" />}
										</Button>
									</DrawerFooter>
								</DrawerContent>
							</Drawer>
						</motion.div>
					) : (
						<motion.div
							key="close"
							initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
							animate={{ rotate: 0, opacity: 1, scale: 1 }}
							exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
							transition={{ duration: 0.2 }}
						>
							<X className="text-sidebar-ring size-5.5" />
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	)
}

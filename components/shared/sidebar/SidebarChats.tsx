"use client"

import { SidebarContent, SidebarGroup, SidebarMenu } from "@/components/ui/sidebar"
import { Conversation } from "@/db/schema"
import { Api } from "@/services/clientApi"
import { useQuery } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import { useDebounce } from "react-use"
import { SidebarChatItem } from "./SidebarChatItem"
import { SidebarChatItemSkeleton } from "./SidebarChatItemSkeleton"
import { AnimatePresence, motion } from "framer-motion"

interface Props {
  className?: string
  searchValue: string
}

export const SidebarChats: React.FC<Props> = ({ className, searchValue }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["chats"],
    queryFn: () => Api.conversation.get(),
  })

  const [chats, setChats] = useState<Conversation[]>([])

  useDebounce(
    () => {
      if (!data) return

      if (!searchValue) {
        setChats(data)
      } else {
        const q = searchValue.toLowerCase()
        setChats(data.filter(chat => chat.title?.toLowerCase().includes(q)))
      }
    },
    150,
    [searchValue, data]
  )

  return (
    <SidebarContent>
      <SidebarGroup className="px-0">
        <SidebarMenu>
          {isLoading &&
            Array.from({ length: 12 }).map((_, i) => (
              <SidebarChatItemSkeleton key={i} />
            ))}

          {!isLoading && (
            <AnimatePresence mode="popLayout">
              {chats.map(chat => (
                <motion.div
                  key={chat.id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                >
                  <SidebarChatItem
                    title={chat.title ?? "Untitled Chat"}
                    preview="Last message preview goes here"
                    time="2:30 PM"
                    unreadCount={4}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  )
}

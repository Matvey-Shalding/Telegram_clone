"use client";

import { Api } from "@/services/clientApi";
import { useQuery } from "@tanstack/react-query";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ChatListItem } from "./ChatListItem";
import { ChatListItemSkeleton } from "./ChatListItemSkeleton";

interface Props {
  className?: string;
}

export const ChatList: React.FC<Props> = ({ className }) => {
  const { data: chats, isLoading } = useQuery({
    queryKey: ["chats"],
    queryFn: () => Api.conversation.get(),
  });

  return (
    <SidebarGroup className={cn(className, "px-0")}>
      <SidebarGroupContent>
        <SidebarMenu className="flex flex-col">
          {isLoading &&
            Array.from({ length: 12 }).map((_, i) => (
              <ChatListItemSkeleton key={i} />
            ))}

          {!isLoading &&
            chats?.map((chat) => (
              <ChatListItem
                key={chat.id}
                title={chat.title ?? "Untitled Chat"}
                preview="Last message preview goes here"
                time="2:30 PM"
                unreadCount={4}
              />
            ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

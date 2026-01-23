"use client";

import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { AvatarWithBadge } from "./AvatarWithBadge";

interface ChatListItemProps {
  title: string;
  preview?: string;
  time?: string;
  unreadCount?: number;
}

export const ChatListItem: React.FC<ChatListItemProps> = ({
  title,
  preview = "Last message preview goes here",
  time = "2:30 PM",
  unreadCount = 0,
}) => {
  return (
    <SidebarMenuItem className="w-full">
      <SidebarMenuButton
        className="rounded-none py-3 h-auto flex items-center gap-x-2"
        tooltip={title}
      >
        {/* Avatar (icon slot) */}
        <AvatarWithBadge />

        {/* Label slot (hidden in collapsed mode) */}
        <div
          className="flex flex-col gap-y-0.5 basis-full"
          data-sidebar="label"
        >
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{title}</span>
            <span className="text-xs text-muted-foreground">{time}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground truncate">
              {preview}
            </span>

            {unreadCount > 0 && (
              <div className="size-5 rounded-full bg-muted grid place-content-center text-xs">
                {unreadCount}
              </div>
            )}
          </div>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

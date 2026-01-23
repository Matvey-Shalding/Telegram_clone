import { Menu } from "lucide-react";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "../ui/sidebar";
import { ChatList } from "./ChatList";

export const AppSidebar = () => {
  return (
    <Sidebar className='' variant="sidebar" collapsible="icon">
      <SidebarHeader className="flex items-center flex-row py-3 px-3 gap-x-3 justify-between">
        <Menu className="text-muted-foreground" size={28} />
        <Input className='min-h-8' placeholder="Search..." />
      </SidebarHeader>

      <Separator />

      <SidebarContent className='px-0'>
        <ChatList />
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
};

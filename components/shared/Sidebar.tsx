import { Menu } from "lucide-react";
import React from "react";
import { Input } from "../ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
} from "../ui/sidebar";
import { Separator } from '../ui/separator'
interface Props {
  className?: string;
}
export const AppSidebar: React.FC<Props> = ({ className }) => {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="flex items-center gap-x-4 justify-between">
          <Menu className='text-muted-foreground' size={28} />
          <Input placeholder="Search..." />
        </SidebarHeader>
        <Separator />
        <SidebarContent>
          
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
};

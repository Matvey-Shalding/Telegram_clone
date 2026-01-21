import React from "react";
import { Sidebar, SidebarHeader, SidebarProvider } from '../ui/sidebar'
interface Props {
  className?: string;
}
export const AppSidebar: React.FC<Props> = ({ className }) => {
  return <SidebarProvider>
		<Sidebar>
			<SidebarHeader></SidebarHeader>
		</Sidebar>
	</SidebarProvider>
};

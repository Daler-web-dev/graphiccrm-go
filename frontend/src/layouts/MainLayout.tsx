import SideBar from "@/components/custom/SideBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout: React.FC = () => {

	return (
		<SidebarProvider className="flex h-screen">
			<SideBar />
			<main className="bg-cWhite w-full min-h-screen">
				<SidebarTrigger />
				<Outlet />
			</main>
		</SidebarProvider>
	);
};

export default MainLayout;
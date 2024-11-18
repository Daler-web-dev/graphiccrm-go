import SideBar from "@/components/custom/SideBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import { Outlet } from "react-router-dom";


const MainLayout: React.FC = () => {
	// const fetchData = async () => {
	// 	try {
	// 		const data = await getRequest({ url: "/products" });
	// 		console.log("Fetched data:", data);
	// 	} catch (error) {
	// 		console.error("Error fetching data:", error);
	// 	}
	// };

	// useEffect(() => {
	// 	fetchData().then((res) => console.log(res));
	// }, []);
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
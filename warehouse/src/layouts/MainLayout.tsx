import { Container } from "@/components/custom/Container";
import { Header } from "@/components/custom/Header";
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
		<SidebarProvider className="flex">
			<SideBar />
			<main className="bg-cWhite w-full">
				<Container className="py-8">
					<Header sideBarTrigger={<SidebarTrigger className="text-cDarkBlue" />} />
					<Outlet />
				</Container>
			</main>
		</SidebarProvider>
	);
};

export default MainLayout;
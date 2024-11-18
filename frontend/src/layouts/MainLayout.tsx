import { Button } from "@/components/ui/button";
import { getRequest } from "@/lib/apiHandlers";
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";

interface MainLayoutProps {}

const MainLayout: React.FC<MainLayoutProps> = () => {
	const fetchData = async () => {
		try {
			const data = await getRequest({ url: "/products" });
			console.log("Fetched data:", data);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	useEffect(() => {
		fetchData().then((res) => console.log(res));
	}, []);
	return (
		<div>
			<h1 className="text-3xl font-bold underline">Hello world!</h1>
			<Button>Click</Button>
			<Outlet />
		</div>
	);
};

export default MainLayout;

import { Button } from "@/components/ui/button";
import React from "react";
import { Outlet } from "react-router-dom";

interface MainLayoutProps {}

const MainLayout: React.FC<MainLayoutProps> = () => {
	return (
		<div>
			<h1 className="text-3xl font-bold underline">Hello world!</h1>
			<Button>Click</Button>
			<Outlet />
		</div>
	);
};

export default MainLayout;

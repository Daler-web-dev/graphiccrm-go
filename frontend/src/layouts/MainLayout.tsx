import React from "react";
import { Outlet } from "react-router-dom";

interface MainLayoutProps {}

const MainLayout: React.FC<MainLayoutProps> = () => {
	return (
		<div>
			<h1>layout</h1>
			<Outlet />
		</div>
	);
};

export default MainLayout;

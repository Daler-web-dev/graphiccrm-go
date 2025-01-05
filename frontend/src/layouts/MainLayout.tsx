import { Container } from "@/components/custom/Container";
import { Header } from "@/components/custom/Header";
import SideBar from "@/components/custom/SideBar";
import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout: React.FC = () => {
	return (
		<Container className="flex">
			<SideBar />
			<div className="pl-[276px] w-full">
				<Header />
				<Outlet />
			</div>
		</Container>
	);
};

export default MainLayout;
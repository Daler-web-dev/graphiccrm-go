import { Container } from "@/components/custom/Container";
import { Header } from "@/components/custom/Header";
import Sidebar from "@/components/custom/SideBar";
import { parseJwt } from "@/lib/utils";
import Cookies from "js-cookie";
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const MainLayout: React.FC = () => {
	const navigate = useNavigate();

	useEffect(() => {
		const handleAuth = async () => {
			const accessToken = Cookies.get("accessToken");

			if (!accessToken) {
				navigate("/auth/signin");
				return;
			}

			const jwtAccessToken = parseJwt(accessToken);


			if (jwtAccessToken.exp < Date.now() / 1000) {
				navigate("/auth/signin");
			}
		}

		handleAuth();
	}, [navigate]);


	return (
		<Container className="flex">
			<Sidebar />
			<div className="pl-[276px] w-full">
				<Header />
				<Outlet />
			</div>
		</Container>
	);
};

export default MainLayout;
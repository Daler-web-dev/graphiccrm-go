import { Outlet, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Signin from "./pages/signin/Signin";
import { Product } from "./pages/warehouse/[id]/page";
import { Warehouse } from "./pages/warehouse/page";
import { HistoryView } from "./pages/history/[id]/page";
import { History } from "./pages/history/page";
import { Dashboard } from "./pages/page";
import { AddProduct } from "./pages/warehouse/addProduct/page";

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<MainLayout />}>
					<Route index element={<Dashboard />} />
					<Route
						path="/history"
						element={<History />}
					/>
					<Route
						path="/history/:id"
						element={<HistoryView />}
					/>
					<Route
						path="/warehouse"
						element={<Warehouse />}
					/>
					<Route
						path="/warehouse/:id"
						element={<Product />}
					/>
					<Route
						path="/warehouse/addProduct"
						element={<AddProduct />}
					/>
				</Route>
				<Route
					path="/auth"
					element={
						<div>
							{/* another layout should be placed here */}
							<Outlet />{" "}
						</div>
					}
				>
					<Route path="/auth/signin" element={<Signin />} />
				</Route>
			</Routes>
		</>
	);
}

export default App;

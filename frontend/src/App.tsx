import { Outlet, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Signin from "./pages/signin/Signin";
import { Users } from "./pages/users/page";
import { Dashboard } from "./pages/page";
import { User } from "./pages/users/[id]/page";
import { History } from "./pages/history/page";
import { HistoryView } from "./pages/history/[id]/page";
import { Warehouse } from "./pages/warehouse/page";
import { Product } from "./pages/warehouse/[id]/page";

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<MainLayout />}>
					<Route index element={<Dashboard />} />
					<Route
						path="/users"
						element={<Users />}
					/>
					<Route
						path="/users/:id"
						element={<User />}
					/>
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
						path="/prices"
						element={<div>some page with data</div>}
					/>
					<Route
						path="/prices/:id"
						element={<div>dynamic page</div>}
					/>
					<Route
						path="/categories"
						element={<div>some page with data</div>}
					/>
				</Route>
				{/* auth route layout */}
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

import { Outlet, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Signin from "./pages/Signin";
import { Users } from "./pages/users/page";
import { Dashboard } from "./pages/dashboard/page";
import { User } from "./pages/users/[id]/page";

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
						element={<div>some page with data</div>}
					/>
					<Route
						path="/history/:id"
						element={<div>dynamic page</div>}
					/>
					<Route
						path="/warehouse"
						element={<div>some page with data</div>}
					/>
					<Route
						path="/warehouse/:id"
						element={<div>dynamic page</div>}
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

import { Outlet, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

function App() {
	return (
		<>
			<Routes>
				{/* main route layout */}
				<Route path="/" element={<MainLayout />}>
					<Route index element={<div>Home page</div>} />
					<Route
						path="/users"
						element={<div>some page with data</div>}
					/>
					<Route
						path="/users/:id"
						element={<div>dynamic page</div>}
					/>
				</Route>
				{/* auth route layout */}
				<Route
					path="/auth"
					element={
						<div>
							another layout should be placed here <Outlet />{" "}
						</div>
					}
				>
					<Route
						path="/auth/signin"
						element={<div>Login page</div>}
					/>
					<Route
						path="/auth/signup"
						element={<div>sign up page</div>}
					/>
				</Route>
			</Routes>
		</>
	);
}

export default App;

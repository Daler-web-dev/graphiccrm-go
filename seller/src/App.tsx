import { Outlet, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { Users } from "./pages/users/page";
import { User } from "./pages/users/[id]/page";
import Signin from "./pages/signin/Signin";
import { Dashboard } from "./pages/page";
import { History } from "./pages/history/page";
import { HistoryView } from "./pages/history/[id]/page";
import { NewOrder } from "./pages/newOrder/page";
import { Checkout } from "./pages/newOrder/checkout/page";
import { AddClient } from "./pages/users/addClient/page";
import Editor from "./pages/editor/page";

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<MainLayout />}>
					<Route index element={<Dashboard />} />
					<Route path="/users" element={<Users />} />
					<Route path="/users/:id" element={<User />} />
					<Route path="/users/addClient" element={<AddClient />} />
					<Route path="/history" element={<History />} />
					<Route path="/history/:id" element={<HistoryView />} />
					<Route path="/newOrder" element={<NewOrder />} />
					{/* <Route path="/newOrder/editor" element={<Editor />} /> */}
					<Route path="/newOrder/checkout" element={<Checkout />} />
					<Route path="/editor" element={<Editor />} />
				</Route>
				<Route
					path="/auth"
					element={
						<div>
							{/* another layout should be placed here  */}
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

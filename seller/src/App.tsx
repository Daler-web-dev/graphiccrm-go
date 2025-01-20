import { Outlet, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Signin from "./pages/signin/Signin";
import { Dashboard } from "./pages/page";
import { Orders } from "./pages/orders/page";
import { Order } from "./pages/orders/[id]/page";
import { EditClient } from "./pages/clients/edit/page";
import { AddClient } from "./pages/clients/new/page";
import { Client } from "./pages/clients/[id]/page";
import { Clients } from "./pages/clients/page";
import Editor from "./pages/newOrder/editor/page";
import { NewOrder } from "./pages/newOrder/page";

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<MainLayout />}>
					<Route index element={<Dashboard />} />
					<Route path="/clients" element={<Clients />} />
					<Route path="/clients/:id" element={<Client />} />
					<Route path="/clients/new" element={<AddClient />} />
					<Route path="/clients/edit/:id" element={<EditClient />} />
					<Route path="/orders" element={<Orders />} />
					<Route path="/orders/:id" element={<Order />} />
					<Route path="/newOrder" element={<NewOrder />} />
					<Route path="/newOrder/editor" element={<Editor />} />
				</Route>
				<Route
					path="/auth"
					element={
						<div>
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

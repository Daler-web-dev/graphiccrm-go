import { Outlet, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Signin from "./pages/signin/Signin";
import { Dashboard } from "./pages/page";
import { Products } from "./pages/products/page";
import { Product } from "./pages/products/[id]/page";
import { Categories } from "./pages/caterogies/page";
import { Employees } from "./pages/employees/page";
import { Clients } from "./pages/clients/page";
import { Client } from "./pages/clients/[id]/page";
import { AddClient } from "./pages/clients/new/page";
import { EditClient } from "./pages/clients/edit/page";
import { Orders } from "./pages/orders/page";
import { Order } from "./pages/orders/[id]/page";
import { Employee } from "./pages/employees/[id]/page";
import { AddEmployee } from "./pages/employees/new/page";

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<MainLayout />}>
					<Route index element={<Dashboard />} />
					<Route
						path="/clients"
						element={<Clients />}
					/>
					<Route
						path="/clients/:id"
						element={<Client />}
					/>
					<Route
						path="/clients/new"
						element={<AddClient />}
					/>
					<Route
						path="/clients/edit/:id"
						element={<EditClient />}
					/>
					<Route
						path="/orders"
						element={<Orders />}
					/>
					<Route
						path="/orders/:id"
						element={<Order />}
					/>
					<Route
						path="/products"
						element={<Products />}
					/>
					<Route
						path="/products/:id"
						element={<Product />}
					/>
					<Route
						path="/categories"
						element={<Categories />}
					/>
					<Route
						path="/employees"
						element={<Employees />}
					/>
					<Route
						path="/employees/:id"
						element={<Employee />}
					/>
					<Route
						path="/employees/new"
						element={<AddEmployee />}
					/>
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

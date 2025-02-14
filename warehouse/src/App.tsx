import { Outlet, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Signin from "./pages/signin/Signin";
import { Dashboard } from "./pages/page";
import { Orders } from "./pages/orders/page";
import { Order } from "./pages/orders/[id]/page";
import { Products } from "./pages/products/page";
import { Product } from "./pages/products/[id]/page";
import { NewProduct } from "./pages/products/new/page";
import { EditProduct } from "./pages/products/edit/page";

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<MainLayout />}>
					<Route index element={<Dashboard />} />
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
						path="/products/new"
						element={<NewProduct />}
					/>
					<Route
						path="/products/edit/:id"
						element={<EditProduct />}
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

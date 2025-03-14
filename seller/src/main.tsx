import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { StateManagerProvider } from "./contexts/useStateContext.tsx";
import { Toaster } from "./components/ui/toaster.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<BrowserRouter basename="/seller">
			<StateManagerProvider>
				<App />
				<Toaster />
			</StateManagerProvider>
		</BrowserRouter>
	</React.StrictMode>
);

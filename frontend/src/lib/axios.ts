// axios.ts
import Axios, {
	AxiosInstance,
	InternalAxiosRequestConfig,
	AxiosResponse,
	AxiosHeaders,
} from "axios";

const serverUrl = import.meta.env.VITE_API_URL as string | undefined;

if (!serverUrl) {
	throw new Error("VITE_PUBLIC_API is not defined");
}

export const baseURL = `${serverUrl}`;

const axios: AxiosInstance = Axios.create({
	baseURL,
	timeout: 120000, // Устанавливаем таймаут
});

axios.interceptors.request.use(
	async function (
		config: InternalAxiosRequestConfig
	): Promise<InternalAxiosRequestConfig> {
		const token = "token";

		// Убедимся, что headers существует и имеет тип AxiosHeaders
		if (!config.headers) {
			config.headers = new AxiosHeaders();
		}

		if (token) {
			config.headers.set("Authorization", `Bearer ${token}`);
			// config.headers.set("Access-Control-Allow-Credentials", "true");
			config.headers.set("Content-Type", "application/json");
		}

		return config;
	},
	function (error) {
		return Promise.reject(error);
	}
);

axios.interceptors.response.use(
	(res: AxiosResponse) => {
		return res;
	},
	(error) => {
		if (error?.response?.status === 403) {
			// Handle forbidden error
		}
		if (error?.response?.status === 401) {
			// Handle unauthorized error (e.g., log out the user)
		}
		throw error; // Propagate the error
	}
);

export default axios;

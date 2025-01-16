import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import Cookies from "js-cookie";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function parseJwt(token: string) {
	var base64Url = token.split(".")[1];
	var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
	var jsonPayload = decodeURIComponent(
		atob(base64)
			.split("")
			.map(function (c) {
				return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
			})
			.join("")
	);

	return JSON.parse(jsonPayload);
}

export const formatPrice = (price: number) => {
	const formattedPrice = new Intl.NumberFormat('uz-UZ', {
		style: 'currency',
		currency: 'UZS',
		minimumFractionDigits: 0,
	});

	return formattedPrice.format(price);
}

export const refreshTokenHandler = async (): Promise<string | null> => {
	const refreshToken = Cookies.get("refreshToken");

	if (!refreshToken) {
		return null;
	}

	const response = await fetch(import.meta.env.VITE_API_URL + "/auth/refresh", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			refreshToken,
		}),
	});

	if (!response.ok) {
		throw new Error("Failed to refresh token");
	}

	const data = await response.json();
	const { access_token: accessToken, refresh_token: newRefreshToken } = data;

	Cookies.set("accessToken", accessToken);
	Cookies.set("refreshToken", newRefreshToken);

	return accessToken;
};
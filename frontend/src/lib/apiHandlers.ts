import { AxiosResponse, AxiosRequestConfig } from "axios";
import axios from "./axios";

type RequestOptions = {
	url: string;
	data?: Record<string, unknown>;
	params?: Record<string, unknown>;
};

type ErrorResponse = {
	error: any;
	status: number;
	data?: any;
};

export const getRequest = async ({
	url,
	params = {},
}: RequestOptions): Promise<AxiosResponse | ErrorResponse> => {
	try {
		const response = await axios.get(url, { params });
		return response;
	} catch (error: any) {
		console.error("GET Request Error:", error);
		return {
			error,
			status: error.response?.status || 500,
			data: error.response?.data || null,
		};
	}
};

export const postRequest = async ({
	url,
	data = {},
	params = {},
}: RequestOptions): Promise<AxiosResponse | ErrorResponse> => {
	try {
		const response = await axios.post(url, data, { params });

		return response;
	} catch (error: any) {
		console.error("POST Request Error:", error);
		return {
			error,
			status: error.response?.status || 500,
			data: error.response?.data || null,
		};
	}
};

export const postFormDataRequest = async ({
	url,
	data,
	params = {},
}: RequestOptions): Promise<AxiosResponse | ErrorResponse> => {
	try {
		const config: AxiosRequestConfig = {
			params,
			headers: {
				"Content-Type": "multipart/form-data",
			},
		};
		const response = await axios.post(url, data, config);
		return response;
	} catch (error: any) {
		console.error("POST FormData Request Error:", error);
		return {
			error,
			status: error.response?.status || 500,
			data: error.response?.data || null,
		};
	}
};

export const patchRequest = async ({
	url,
	data = {},
	params = {},
}: RequestOptions): Promise<AxiosResponse | ErrorResponse> => {
	try {
		const response = await axios.patch(url, data, { params });
		return response;
	} catch (error: any) {
		console.error("PATCH Request Error:", error);
		return {
			error,
			status: error.response?.status || 500,
			data: error.response?.data || null,
		};
	}
};

export const patchFormDataRequest = async ({
	url,
	data = {},
	params = {},
}: RequestOptions): Promise<AxiosResponse | ErrorResponse> => {
	try {
		const config: AxiosRequestConfig = {
			params,
			headers: {
				"Content-Type": "multipart/form-data",
			},
		};
		const response = await axios.patch(url, data, config);
		return response;
	} catch (error: any) {
		console.error("PATCH FormData Request Error:", error);
		return {
			error,
			status: error.response?.status || 500,
			data: error.response?.data || null,
		};
	}
};

export const putRequest = async ({
	url,
	data = {},
	params = {},
}: RequestOptions): Promise<AxiosResponse | ErrorResponse> => {
	try {
		const response = await axios.put(url, data, { params });
		return response;
	} catch (error: any) {
		console.error("PUT Request Error:", error);
		return {
			error,
			status: error.response?.status || 500,
			data: error.response?.data || null,
		};
	}
};

export const deleteRequest = async ({
	url,
	params = {},
}: RequestOptions): Promise<AxiosResponse | ErrorResponse> => {
	try {
		const response = await axios.delete(url, { params });
		return response;
	} catch (error: any) {
		console.error("DELETE Request Error:", error);
		return {
			error,
			status: error.response?.status || 500,
			data: error.response?.data || null,
		};
	}
};

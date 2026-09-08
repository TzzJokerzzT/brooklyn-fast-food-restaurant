import { toast } from "@heroui/react";
import axios, { type AxiosError } from "axios";

// ── Axios Instance ──────────────────────────────────────────
// Centralized HTTP client with interceptors for auth and error handling.
// Uses httpOnly cookies — browser sends them automatically with withCredentials.

const API_BASE =
	process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

export const apiClient = axios.create({
	baseURL: API_BASE,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 15_000,
	withCredentials: true, // Required for cross-origin httpOnly cookies
});

// Re-export cookie key constants for backward compatibility
export { COOKIE_KEYS } from "./cookies";

// ── Error Normalization ─────────────────────────────────────
// Extracts a consistent error message from any API response

export function getErrorMessage(error: unknown): string {
	if (axios.isCancel(error)) return "Request cancelled";

	const axiosError = error as AxiosError<{
		message?: string;
		errors?: Array<{ message: string }>;
	}>;

	// Backend validation errors array
	if (axiosError.response?.data?.errors?.length) {
		return axiosError.response.data.errors.map((e) => e.message).join(", ");
	}

	// Backend single message
	if (axiosError.response?.data?.message) {
		return axiosError.response.data.message;
	}

	// Axios status text
	if (axiosError.response?.statusText) {
		return axiosError.response.statusText;
	}

	// Network error
	if (axiosError.message?.includes("Network Error")) {
		return "Network error. Check your connection.";
	}

	// Timeout
	if (axiosError.message?.includes("timeout")) {
		return "Request timed out. Try again.";
	}

	// Fallback
	return axiosError.message || "An unexpected error occurred";
}

// ── Request Interceptor ─────────────────────────────────────
// No token attachment needed — httpOnly cookies are sent automatically.

apiClient.interceptors.request.use(
	(config) => config,
	(error) => Promise.reject(error),
);

// ── Response Interceptor ────────────────────────────────────
// Handles 401 by attempting token refresh via httpOnly cookie,
// then retries original request. Shows toast for 5xx/network errors.

let isRefreshing = false;
let failedQueue: Array<{
	resolve: (value: unknown) => void;
	reject: (reason?: unknown) => void;
}> = [];

function processQueue(error: unknown): void {
	failedQueue.forEach(({ resolve, reject }) => {
		if (error) {
			reject(error);
		} else {
			resolve(undefined);
		}
	});
	failedQueue = [];
}

apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		const status = error.response?.status;

		// Skip refresh for login/register/refresh/logout or if already retried
		if (
			status !== 401 ||
			originalRequest._retry ||
			originalRequest.url?.includes("/auth/login") ||
			originalRequest.url?.includes("/auth/register") ||
			originalRequest.url?.includes("/auth/refresh") ||
			originalRequest.url?.includes("/auth/logout")
		) {
			// Show toast for 5xx errors
			if (status && status >= 500) {
				toast.danger(getErrorMessage(error), {
					description: "Server error. Please try again later.",
				});
			}

			// Show toast for network errors
			if (!error.response && !axios.isCancel(error)) {
				toast.danger("Connection error", {
					description: "Check your internet connection and try again.",
				});
			}

			return Promise.reject(error);
		}

		if (isRefreshing) {
			return new Promise((resolve, reject) => {
				failedQueue.push({ resolve, reject });
			}).then(() => apiClient(originalRequest));
		}

		originalRequest._retry = true;
		isRefreshing = true;

		try {
			// Refresh token is in httpOnly cookie — sent automatically
			// Use bare axios to avoid interceptor loop
			const { data } = await axios.post(
				`${API_BASE}/auth/refresh`,
				{},
				{ withCredentials: true },
			);

			if (data.success) {
				// New tokens set as httpOnly cookies by backend
				processQueue(null);
				return apiClient(originalRequest);
			}

			throw new Error("Refresh failed");
		} catch (refreshError) {
			// Refresh failed — backend should clear cookies via /auth/logout
			// For now, clear Zustand state (handled by useMe returning null)
			await axios
				.post(`${API_BASE}/auth/logout`, {}, { withCredentials: true })
				.catch(() => {});
			processQueue(refreshError);
			return Promise.reject(refreshError);
		} finally {
			isRefreshing = false;
		}
	},
);

export default apiClient;

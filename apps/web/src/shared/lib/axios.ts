import axios, { type AxiosError } from "axios";
import { toast } from "@heroui/react";

// ── Axios Instance ──────────────────────────────────────────
// Centralized HTTP client with interceptors for auth and error handling

const API_BASE =
	process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

export const apiClient = axios.create({
	baseURL: API_BASE,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 15_000,
});

// ── Token Storage Helpers ───────────────────────────────────
// Using sessionStorage for security (clears on tab close)

const TOKEN_KEYS = {
	access: "brooklyn_access_token",
	refresh: "brooklyn_refresh_token",
} as const;

export const tokenStorage = {
	getAccessToken: (): string | null => {
		if (typeof window === "undefined") return null;
		return sessionStorage.getItem(TOKEN_KEYS.access);
	},
	getRefreshToken: (): string | null => {
		if (typeof window === "undefined") return null;
		return sessionStorage.getItem(TOKEN_KEYS.refresh);
	},
	setTokens: (accessToken: string, refreshToken: string): void => {
		if (typeof window === "undefined") return;
		sessionStorage.setItem(TOKEN_KEYS.access, accessToken);
		sessionStorage.setItem(TOKEN_KEYS.refresh, refreshToken);
	},
	clearTokens: (): void => {
		if (typeof window === "undefined") return;
		sessionStorage.removeItem(TOKEN_KEYS.access);
		sessionStorage.removeItem(TOKEN_KEYS.refresh);
	},
};

// ── Error Normalization ─────────────────────────────────────
// Extracts a consistent error message from any API response

export function getErrorMessage(error: unknown): string {
	if (axios.isCancel(error)) return "Request cancelled";

	const axiosError = error as AxiosError<{ message?: string; errors?: Array<{ message: string }> }>;

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
// Attaches access token to every request

apiClient.interceptors.request.use(
	(config) => {
		const token = tokenStorage.getAccessToken();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

// ── Response Interceptor ────────────────────────────────────
// Handles 401 by attempting token refresh, then retries original request
// Shows toast for 5xx and network errors

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

		// Skip refresh for login/register/refresh endpoints or if already retried
		if (
			status !== 401 ||
			originalRequest._retry ||
			originalRequest.url?.includes("/auth/login") ||
			originalRequest.url?.includes("/auth/register") ||
			originalRequest.url?.includes("/auth/refresh")
		) {
			// Show toast for 5xx errors (not 4xx — those are validation/client errors)
			if (status && status >= 500) {
				toast.danger(getErrorMessage(error), {
					description: "Server error. Please try again later.",
				});
			}

			// Show toast for network errors (no response)
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

		const refreshToken = tokenStorage.getRefreshToken();

		if (!refreshToken) {
			tokenStorage.clearTokens();
			isRefreshing = false;
			return Promise.reject(error);
		}

		try {
			// Use bare axios to avoid interceptor loop
			const { data } = await axios.post(`${API_BASE}/auth/refresh`, {
				refreshToken,
			});

			if (data.success) {
				const { accessToken, refreshToken: newRefresh } = data.data;
				tokenStorage.setTokens(accessToken, newRefresh);
				originalRequest.headers.Authorization = `Bearer ${accessToken}`;
				processQueue(null);
				return apiClient(originalRequest);
			}

			throw new Error("Refresh failed");
		} catch (refreshError) {
			tokenStorage.clearTokens();
			processQueue(refreshError);
			return Promise.reject(refreshError);
		} finally {
			isRefreshing = false;
		}
	},
);

export default apiClient;

import axios from "axios";

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

		// Skip refresh for login/register/refresh endpoints or if already retried
		if (
			error.response?.status !== 401 ||
			originalRequest._retry ||
			originalRequest.url?.includes("/auth/login") ||
			originalRequest.url?.includes("/auth/register") ||
			originalRequest.url?.includes("/auth/refresh")
		) {
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

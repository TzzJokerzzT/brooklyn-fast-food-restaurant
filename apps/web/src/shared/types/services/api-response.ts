// ── API Response Types ──────────────────────────────────────
// Shared types matching the backend Express response shapes

export interface ApiResponse<T> {
	success: boolean;
	data: T;
	message?: string;
}

export interface ApiError {
	success: false;
	message: string;
}

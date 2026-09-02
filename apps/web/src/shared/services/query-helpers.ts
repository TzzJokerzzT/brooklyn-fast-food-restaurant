import type { ApiResponse } from "./types";

// ── Query Helpers ───────────────────────────────────────────
// Eliminates the res.success ? res.data : null boilerplate

export class ApiQueryError extends Error {
	constructor(
		message: string,
		public statusCode?: number,
	) {
		super(message);
		this.name = "ApiQueryError";
	}
}

/**
 * Unwraps an ApiResponse, throwing on failure.
 * Use in queryFn to eliminate the `res.success ? res.data : null` pattern.
 *
 * @example
 * queryFn: async () => {
 *   const res = await usersService.getAll(params);
 *   return handleApiResponse(res);
 * }
 */
export function handleApiResponse<T>(response: ApiResponse<T>): T {
	if (!response.success) {
		throw new ApiQueryError(response.message || "Request failed");
	}
	return response.data;
}

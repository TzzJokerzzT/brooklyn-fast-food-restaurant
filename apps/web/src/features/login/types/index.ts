// ── Login Types ──────────────────────────────────────
// Domain types for the login feature

export interface Login {
	id: number;
	// TODO: add fields
	createdAt: string;
	updatedAt: string;
}

export type CreateLoginDTO = {};

export type UpdateLoginDTO = {};

export interface FindAllLoginParams {
	page?: number;
	limit?: number;
	search?: string;
}

export interface PaginatedLogin {
	items: Login[];
	total: number;
	page: number;
	limit: number;
}

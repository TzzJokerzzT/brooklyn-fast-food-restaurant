// ── Role Entity ──────────────────────────────────────────────
// Core business entity for roles

export interface Role {
	id: number;
	name: string;
}

export interface CreateRoleDTO {
	name: string;
}

export interface UpdateRoleDTO {
	name?: string;
}

// Default roles
export const DEFAULT_ROLES = {
	SUPER_ADMIN: 1,
	ADMIN: 2,
	CLIENTS: 3,
} as const;

export const ROLE_NAMES = {
	SUPER_ADMIN: "super-admin",
	ADMIN: "admin",
	CLIENTS: "clients",
} as const;

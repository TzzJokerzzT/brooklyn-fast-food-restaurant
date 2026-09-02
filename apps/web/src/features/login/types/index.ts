// ── Login Types ──────────────────────────────────────
// Domain types for the login feature

export interface Login {
  id: number;
  // TODO: add fields
  createdAt: string;
  updatedAt: string;
}

export interface CreateLoginDTO {
  // TODO: add required fields
}

export interface UpdateLoginDTO {
  // TODO: add optional fields
}

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

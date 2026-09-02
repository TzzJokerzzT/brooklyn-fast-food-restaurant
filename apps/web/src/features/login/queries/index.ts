import type { FindAllLoginParams } from "../types";

// ── Query Keys ──────────────────────────────────────────────
// Centralized keys for TanStack Query cache management

export const loginKeys = {
  all: ["login"] as const,
  lists: () => [...loginKeys.all, "list"] as const,
  list: (params?: FindAllLoginParams) =>
    [...loginKeys.lists(), params] as const,
  details: () => [...loginKeys.all, "detail"] as const,
  detail: (id: number) => [...loginKeys.details(), id] as const,
};

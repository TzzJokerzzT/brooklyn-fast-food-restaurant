#!/usr/bin/env bash
set -euo pipefail

# ──────────────────────────────────────────────────────────────
# create-feature.sh — Vertical Slice feature scaffolder
# Usage: ./scripts/create-feature.sh <feature-name>
# ──────────────────────────────────────────────────────────────

FEATURE_NAME="${1:-}"

if [[ -z "$FEATURE_NAME" ]]; then
  echo "Error: feature name is required"
  echo "Usage: ./scripts/create-feature.sh <feature-name>"
  echo "Example: ./scripts/create-feature.sh menu-items"
  exit 1
fi

# Validate name: lowercase kebab-case
if [[ ! "$FEATURE_NAME" =~ ^[a-z][a-z0-9]*(-[a-z0-9]+)*$ ]]; then
  echo "Error: feature name must be lowercase kebab-case (e.g. menu-items, order-history)"
  exit 1
fi

# PascalCase conversion: menu-items -> MenuItems
PASCAL_CASE=$(echo "$FEATURE_NAME" | sed -r 's/(^|-)([a-z])/\U\2/g')

FEATURES_DIR="apps/web/src/features"
TARGET_DIR="$FEATURES_DIR/$FEATURE_NAME"

if [[ -d "$TARGET_DIR" ]]; then
  echo "Error: feature '$FEATURE_NAME' already exists at $TARGET_DIR"
  exit 1
fi

echo "Creating feature: $FEATURE_NAME ($PASCAL_CASE)"
echo "Location: $TARGET_DIR"
echo ""

# ── Create directories ────────────────────────────────────────
mkdir -p "$TARGET_DIR"/{components,hooks,queries,services,types}

# ── types/index.ts ────────────────────────────────────────────
cat > "$TARGET_DIR/types/index.ts" << EOF
// ── ${PASCAL_CASE} Types ──────────────────────────────────────
// Domain types for the ${FEATURE_NAME} feature

export interface ${PASCAL_CASE} {
  id: number;
  // TODO: add fields
  createdAt: string;
  updatedAt: string;
}

export interface Create${PASCAL_CASE}DTO {
  // TODO: add required fields
}

export interface Update${PASCAL_CASE}DTO {
  // TODO: add optional fields
}

export interface FindAll${PASCAL_CASE}Params {
  page?: number;
  limit?: number;
  search?: string;
}

export interface Paginated${PASCAL_CASE} {
  items: ${PASCAL_CASE}[];
  total: number;
  page: number;
  limit: number;
}
EOF

# ── services/index.ts ─────────────────────────────────────────
cat > "$TARGET_DIR/services/index.ts" << EOF
import { apiClient } from "@/src/shared/lib/axios";
import type { ApiResponse } from "@/src/shared/services";
import type {
  Create${PASCAL_CASE}DTO,
  FindAll${PASCAL_CASE}Params,
  Paginated${PASCAL_CASE},
  Update${PASCAL_CASE}DTO,
  ${PASCAL_CASE},
} from "../types";

// ── ${PASCAL_CASE} Service ────────────────────────────────────
// API calls using the shared Axios client

const BASE = "/${FEATURE_NAME}";

export const ${FEATURE_NAME//-/}Service = {
  async getAll(
    params?: FindAll${PASCAL_CASE}Params,
  ): Promise<ApiResponse<Paginated${PASCAL_CASE}>> {
    const { data } = await apiClient.get<ApiResponse<Paginated${PASCAL_CASE}>>(
      BASE,
      { params },
    );
    return data;
  },

  async getById(id: number): Promise<ApiResponse<{ item: ${PASCAL_CASE} }>> {
    const { data } = await apiClient.get<ApiResponse<{ item: ${PASCAL_CASE} }>>(
      \`\${BASE}/\${id}\`,
    );
    return data;
  },

  async create(
    dto: Create${PASCAL_CASE}DTO,
  ): Promise<ApiResponse<{ item: ${PASCAL_CASE} }>> {
    const { data } = await apiClient.post<ApiResponse<{ item: ${PASCAL_CASE} }>>(
      BASE,
      dto,
    );
    return data;
  },

  async update(
    id: number,
    dto: Update${PASCAL_CASE}DTO,
  ): Promise<ApiResponse<{ item: ${PASCAL_CASE} }>> {
    const { data } = await apiClient.put<ApiResponse<{ item: ${PASCAL_CASE} }>>(
      \`\${BASE}/\${id}\`,
      dto,
    );
    return data;
  },

  async delete(id: number): Promise<ApiResponse<{ message: string }>> {
    const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
      \`\${BASE}/\${id}\`,
    );
    return data;
  },
};
EOF

# ── queries/index.ts ──────────────────────────────────────────
cat > "$TARGET_DIR/queries/index.ts" << EOF
import type { FindAll${PASCAL_CASE}Params } from "../types";

// ── Query Keys ──────────────────────────────────────────────
// Centralized keys for TanStack Query cache management

export const ${FEATURE_NAME//-/}Keys = {
  all: ["${FEATURE_NAME}"] as const,
  lists: () => [...${FEATURE_NAME//-/}Keys.all, "list"] as const,
  list: (params?: FindAll${PASCAL_CASE}Params) =>
    [...${FEATURE_NAME//-/}Keys.lists(), params] as const,
  details: () => [...${FEATURE_NAME//-/}Keys.all, "detail"] as const,
  detail: (id: number) => [...${FEATURE_NAME//-/}Keys.details(), id] as const,
};
EOF

# ── hooks/index.ts ────────────────────────────────────────────
cat > "$TARGET_DIR/hooks/index.ts" << EOF
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ${FEATURE_NAME//-/}Service } from "../services";
import { ${FEATURE_NAME//-/}Keys } from "../queries";
import type {
  Create${PASCAL_CASE}DTO,
  FindAll${PASCAL_CASE}Params,
  Paginated${PASCAL_CASE},
  Update${PASCAL_CASE}DTO,
  ${PASCAL_CASE},
} from "../types";
import type { ApiResponse } from "@/src/shared/services";

// ── Use ${PASCAL_CASE} List ─────────────────────────────────────

export function use${PASCAL_CASE}s(params?: FindAll${PASCAL_CASE}Params) {
  return useQuery({
    queryKey: ${FEATURE_NAME//-/}Keys.list(params),
    queryFn: async (): Promise<Paginated${PASCAL_CASE} | null> => {
      const res = await ${FEATURE_NAME//-/}Service.getAll(params);
      return res.success ? res.data : null;
    },
  });
}

// ── Use ${PASCAL_CASE} Detail ───────────────────────────────────

export function use${PASCAL_CASE}(id: number) {
  return useQuery({
    queryKey: ${FEATURE_NAME//-/}Keys.detail(id),
    queryFn: async (): Promise<${PASCAL_CASE} | null> => {
      const res = await ${FEATURE_NAME//-/}Service.getById(id);
      return res.success ? res.data.item : null;
    },
    enabled: id > 0,
  });
}

// ── Use Create ${PASCAL_CASE} ───────────────────────────────────

export function useCreate${PASCAL_CASE}() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      dto: Create${PASCAL_CASE}DTO,
    ): Promise<ApiResponse<{ item: ${PASCAL_CASE} }>> =>
      ${FEATURE_NAME//-/}Service.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ${FEATURE_NAME//-/}Keys.lists() });
    },
  });
}

// ── Use Update ${PASCAL_CASE} ───────────────────────────────────

export function useUpdate${PASCAL_CASE}() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      dto,
    }: {
      id: number;
      dto: Update${PASCAL_CASE}DTO;
    }): Promise<ApiResponse<{ item: ${PASCAL_CASE} }>> =>
      ${FEATURE_NAME//-/}Service.update(id, dto),
    onSuccess: (data, variables) => {
      if (data.success) {
        queryClient.setQueryData(
          ${FEATURE_NAME//-/}Keys.detail(variables.id),
          data.data.item,
        );
        queryClient.invalidateQueries({ queryKey: ${FEATURE_NAME//-/}Keys.lists() });
      }
    },
  });
}

// ── Use Delete ${PASCAL_CASE} ──────────────────────────────────

export function useDelete${PASCAL_CASE}() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      id: number,
    ): Promise<ApiResponse<{ message: string }>> =>
      ${FEATURE_NAME//-/}Service.delete(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: ${FEATURE_NAME//-/}Keys.detail(id) });
      queryClient.invalidateQueries({ queryKey: ${FEATURE_NAME//-/}Keys.lists() });
    },
  });
}
EOF

# ── components/index.tsx ──────────────────────────────────────
cat > "$TARGET_DIR/components/index.tsx" << EOF
"use client";

import { use${PASCAL_CASE}s } from "../hooks";

// ── ${PASCAL_CASE} List ────────────────────────────────────────

export function ${PASCAL_CASE}List() {
  const { data, isLoading, error } = use${PASCAL_CASE}s();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>${PASCAL_CASE} List</h2>
      {data?.items.map((item) => (
        <div key={item.id}>{/* TODO: render item */}</div>
      ))}
    </div>
  );
}
EOF

# ── index.ts (barrel export) ──────────────────────────────────
cat > "$TARGET_DIR/index.ts" << EOF
export * from "./components";
export * from "./hooks";
export * from "./services";
export type * from "./types";
EOF

echo "✅ Feature created successfully!"
echo ""
echo "Structure:"
echo "  $TARGET_DIR/"
echo "  ├── components/    # Client components (useClient)"
echo "  ├── hooks/         # TanStack Query hooks (useQuery/useMutation)"
echo "  ├── queries/       # Query key factories"
echo "  ├── services/      # API calls via shared Axios client"
echo "  ├── types/         # TypeScript interfaces + DTOs"
echo "  └── index.ts       # Barrel export"
echo ""
echo "Import with: import { ... } from \"@/src/features/$FEATURE_NAME\";"

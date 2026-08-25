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
mkdir -p "$TARGET_DIR"/{components,hooks,actions,services,types}

# ── types/index.ts ────────────────────────────────────────────
cat > "$TARGET_DIR/types/index.ts" << EOF
export interface ${PASCAL_CASE}State {
  isLoading: boolean;
  error: string | null;
}
EOF

# ── hooks/index.ts ────────────────────────────────────────────
cat > "$TARGET_DIR/hooks/index.ts" << EOF
import { useState, useCallback } from "react";
import type { ${PASCAL_CASE}State } from "../types";

const initialState: ${PASCAL_CASE}State = {
  isLoading: false,
  error: null,
};

export function use${PASCAL_CASE}() {
  const [state, setState] = useState<${PASCAL_CASE}State>(initialState);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return { ...state, reset };
}
EOF

# ── actions/index.ts ──────────────────────────────────────────
cat > "$TARGET_DIR/actions/index.ts" << EOF
"use server";

export async function get${PASCAL_CASE}Data() {
  // TODO: implement server action
  return { data: null };
}
EOF

# ── services/index.ts ─────────────────────────────────────────
cat > "$TARGET_DIR/services/index.ts" << EOF
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function fetch${PASCAL_CASE}() {
  const res = await fetch(\`\${API_BASE}/${FEATURE_NAME}\`);
  if (!res.ok) throw new Error("Failed to fetch ${FEATURE_NAME}");
  return res.json();
}
EOF

# ── components/index.tsx ──────────────────────────────────────
cat > "$TARGET_DIR/components/index.tsx" << EOF
export function ${PASCAL_CASE}Card() {
  return (
    <div>
      <h2>${PASCAL_CASE} Card</h2>
    </div>
  );
}
EOF

# ── index.ts (barrel export) ──────────────────────────────────
cat > "$TARGET_DIR/index.ts" << EOF
export * from "./components";
export * from "./hooks";
export * from "./actions";
export * from "./services";
export type * from "./types";
EOF

echo "✅ Feature created successfully!"
echo ""
echo "Structure:"
echo "  $TARGET_DIR/"
echo "  ├── components/    # UI components"
echo "  ├── hooks/         # Custom React hooks"
echo "  ├── actions/       # Server actions"
echo "  ├── services/      # API/data layer"
echo "  ├── types/         # TypeScript types"
echo "  └── index.ts       # Barrel export"
echo ""
echo "Import with: import { ... } from \"@/features/$FEATURE_NAME\";"

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
mkdir -p "$TARGET_DIR"/{components,hooks,services}

# ── components/index.tsx ──────────────────────────────────────
touch "$TARGET_DIR/components/index.tsx"

# ── hooks/index.ts ────────────────────────────────────────────
touch "$TARGET_DIR/hooks/index.ts"

# ── services/${FEATURE_NAME}.service.ts ───────────────────────
touch "$TARGET_DIR/services/${FEATURE_NAME}.service.ts"

# ── index.ts (barrel export) ──────────────────────────────────
cat > "$TARGET_DIR/index.ts" << EOF
export * from "./components";
export * from "./hooks";
EOF

echo "✅ Feature created successfully!"
echo ""
echo "Structure:"
echo "  $TARGET_DIR/"
echo "  ├── components/    # Client components (useClient)"
echo "  ├── hooks/         # TanStack Query hooks (useQuery/useMutation)"
echo "  ├── services/      # API calls via shared Axios client"
echo "  └── index.ts       # Barrel export"
echo ""
echo "Import with: import { ... } from \"@/src/features/$FEATURE_NAME\";"

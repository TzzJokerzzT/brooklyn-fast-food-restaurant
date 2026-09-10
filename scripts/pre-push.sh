#!/bin/sh
# ── Pre-push hook ────────────────────────────────────────────
# Runs before push to ensure code quality

echo "🚀 Pre-push checks starting..."
echo ""

# ── 1. Lint ───────────────────────────────────────────────────
echo "🧹 Running lint..."
if ! bun run lint; then
	echo ""
	echo "❌ Lint errors found. Fix lint issues before pushing."
	exit 1
fi
echo "✅ Lint passed"
echo ""

# ── 2. Typecheck ──────────────────────────────────────────────
echo "🔎 Running TypeScript type check..."
if ! bun run typecheck; then
	echo ""
	echo "❌ TypeScript errors found. Fix types before pushing."
	exit 1
fi
echo "✅ TypeScript check passed"
echo ""

# ── 3. Tests ──────────────────────────────────────────────────
echo "🧪 Running tests..."
if ! bun run test; then
	echo ""
	echo "❌ Tests failed. Fix tests before pushing."
	exit 1
fi
echo "✅ Tests passed"
echo ""

# ── 4. Build ──────────────────────────────────────────────────
echo "📦 Building project..."
if ! bun run build; then
	echo ""
	echo "❌ Build failed. Fix build errors before pushing."
	exit 1
fi
echo "✅ Build passed"
echo ""

echo "🎉 All pre-push checks passed!"

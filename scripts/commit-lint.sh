#!/bin/sh
# ── Commit message linter ────────────────────────────────────
# Validates conventional commit format

COMMIT_MSG_FILE="$1"
COMMIT_MSG=$(cat "$COMMIT_MSG_FILE")

# Extract first line (title)
TITLE=$(echo "$COMMIT_MSG" | head -n 1)

# ── Validate title length ────────────────────────────────────
TITLE_LENGTH=$(echo -n "$TITLE" | wc -c | tr -d ' ')

if [ "$TITLE_LENGTH" -gt 70 ]; then
  echo ""
  echo "❌ Commit title too long: $TITLE_LENGTH characters (max 70)"
  echo "   Title: $TITLE"
  echo ""
  echo "   Tip: Use a shorter title and add details in the body."
  echo "   Example: feat(auth): add login page"
  exit 1
fi

# ── Validate conventional commit format ──────────────────────
# Pattern: type(scope): description
# Types: feat, fix, chore, style, refactor, perf, test, docs, ci, build, revert
PATTERN="^(feat|fix|chore|style|refactor|perf|test|docs|ci|build|revert)(\([a-z0-9_-]+\))?: .+"

if ! echo "$TITLE" | grep -qE "$PATTERN"; then
  echo ""
  echo "❌ Invalid commit message format"
  echo "   Title: $TITLE"
  echo ""
  echo "   Expected format: type(scope): description"
  echo ""
  echo "   Allowed types:"
  echo "     feat      New feature"
  echo "     fix       Bug fix"
  echo "     chore     Maintenance tasks"
  echo "     style     Code style changes (formatting, no logic change)"
  echo "     refactor  Code refactoring (no feature/fix)"
  echo "     perf      Performance improvements"
  echo "     test      Adding/updating tests"
  echo "     docs      Documentation changes"
  echo "     ci        CI/CD configuration"
  echo "     build     Build system changes"
  echo "     revert    Revert a previous commit"
  echo ""
  echo "   Examples:"
  echo "     feat(auth): add login page"
  echo "     fix(cart): resolve quantity bug"
  echo "     chore: update dependencies"
  exit 1
fi

echo "✅ Commit message valid"

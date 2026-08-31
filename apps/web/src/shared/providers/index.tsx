"use client";

import { QueryProvider } from "@/src/shared/providers/query-provider";

// ── Providers Wrapper ───────────────────────────────────────
// Client component that wraps the app with all context providers.
// Root layout is a Server Component, so providers must be in a
// separate "use client" boundary.

export function Providers({ children }: { children: React.ReactNode }) {
	return <QueryProvider>{children}</QueryProvider>;
}

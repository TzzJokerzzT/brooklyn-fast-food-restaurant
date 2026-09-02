"use client";

import { QueryProvider } from "@/src/shared/providers/query-provider";

import type { ReactNode } from "react";
import ToastProvider from "./toast-provider";

// ── Providers Wrapper ───────────────────────────────────────
// Client component that wraps the app with all context providers.
// Root layout is a Server Component, so providers must be in a
// separate "use client" boundary.

export function Providers({ children }: { children: ReactNode }) {
	return (
		<QueryProvider>
			<ToastProvider />
			{children}
		</QueryProvider>
	);
}

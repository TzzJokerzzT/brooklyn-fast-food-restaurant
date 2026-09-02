"use client";

import { QueryProvider } from "@/src/shared/providers/query-provider";

import { Toast } from "@heroui/react";
import type { ReactNode } from "react";
import { CustomToast, toastQueue } from "../components/Toast";

// ── Providers Wrapper ───────────────────────────────────────
// Client component that wraps the app with all context providers.
// Root layout is a Server Component, so providers must be in a
// separate "use client" boundary.

export function Providers({ children }: { children: ReactNode }) {
	return (
		<QueryProvider>
			<Toast.Provider placement="bottom" queue={toastQueue}>
				{({ toast }) => <CustomToast toast={toast} />}
			</Toast.Provider>
			{children}
		</QueryProvider>
	);
}

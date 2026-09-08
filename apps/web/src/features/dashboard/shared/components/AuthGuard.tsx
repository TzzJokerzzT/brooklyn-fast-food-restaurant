"use client";

import BasicSpinner from "@/src/shared/components/ui/BasicSpinner";
import { useAuthStore } from "@/src/shared/store/auth.store";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// ── Auth Guard ──────────────────────────────────────────────
// Protects dashboard routes by checking authentication state.
// Redirects to /login if unauthenticated. Shows spinner during check.

export default function AuthGuard({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		// Give persist middleware time to rehydrate from sessionStorage
		const timer = setTimeout(() => setIsReady(true), 0);
		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (isReady && !isAuthenticated) {
			router.replace("/login");
		}
	}, [isReady, isAuthenticated, router]);

	// Still rehydrating or redirecting
	if (!isReady || !isAuthenticated) {
		return (
			<div className="flex bg-surface min-h-screen text-on-surface antialiased items-center justify-center">
				<div className="flex flex-col items-center gap-4">
					<BasicSpinner />
					<p className="font-label-bold text-on-surface-variant animate-pulse uppercase">
						Verificando acceso...
					</p>
				</div>
			</div>
		);
	}

	return <>{children}</>;
}

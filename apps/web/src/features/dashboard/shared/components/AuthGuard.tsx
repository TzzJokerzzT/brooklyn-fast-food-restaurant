"use client";

import BasicSpinner from "@/src/shared/components/ui/BasicSpinner";
import { useMe } from "@/src/shared/hooks";
import { useAuthStore } from "@/src/shared/store/auth.store";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// ── Auth Guard ──────────────────────────────────────────────
// Protects dashboard routes by checking authentication + role.
// Only "admin" and "super-admin" roles are allowed.
// Redirects to / if unauthorized. Shows spinner during check.

const ALLOWED_ROLES = ["admin", "super-admin"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const { data: user, isLoading } = useMe();
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		// Give persist middleware time to rehydrate from sessionStorage
		const timer = setTimeout(() => setIsReady(true), 0);
		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		// Wait for useMe to finish loading before checking role
		if (isLoading) return;

		// Not authenticated → redirect to login
		if (isReady && !isAuthenticated) {
			router.replace("/login");
			return;
		}

		// Authenticated but wrong role → redirect to home
		if (isReady && user && !ALLOWED_ROLES.includes(user.role?.name ?? "")) {
			router.replace("/");
		}
	}, [isReady, isAuthenticated, isLoading, user, router]);

	// Still rehydrating, loading user, or redirecting
	if (
		!isReady ||
		!isAuthenticated ||
		isLoading ||
		(user && !ALLOWED_ROLES.includes(user.role?.name ?? ""))
	) {
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

"use client";

import { SplashScreen } from "@/src/shared/components/SplashScreen";
import { useMe } from "@/src/shared/hooks/use-auth";

import type { ReactNode } from "react";

// ── App Initializer ─────────────────────────────────────────
// Wraps the entire app and shows a splash screen while checking
// auth status via /auth/me. Once the response arrives (success or
// failure), renders children immediately.
//
// This eliminates the flash of wrong content on:
// - First load (no cached auth state)
// - bfcache restoration (stale Zustand state)
// - Tab restoration after logout in another tab

export function AppInitializer({ children }: { children: ReactNode }) {
	const { isPending, isFetching } = useMe();

	// Show splash while auth is being determined
	// isPending = first load, isFetching = refetching
	const isLoading = isPending || isFetching;

	return (
		<>
			{isLoading && <SplashScreen />}
			{/* Always render children — splash overlays on top */}
			{/* Opacity transition prevents layout shift */}
			<div className={isLoading ? "invisible" : ""}>{children}</div>
		</>
	);
}

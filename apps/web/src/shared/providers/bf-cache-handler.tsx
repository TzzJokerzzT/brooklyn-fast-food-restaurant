"use client";

import { useAuthStore } from "@/src/shared/store/auth.store";

import { useEffect } from "react";

// ── BFCache Handler ─────────────────────────────────────────
// Handles browser back-forward cache (bfcache) restoration.
// When a page is restored from bfcache, Zustand state may be stale
// (e.g., user logged out in another tab). Since httpOnly cookies
// can't be read from JS, we clear the Zustand state on bfcache
// restore and let useMe() refetch the real auth state.

export function BfCacheHandler() {
	const setUser = useAuthStore((s) => s.setUser);

	useEffect(() => {
		const handlePageShow = (event: PageTransitionEvent) => {
			if (event.persisted) {
				// Page restored from bfcache — clear stale Zustand state.
				// useMe() will refetch /auth/me and restore correct state.
				// If session expired, useMe returns null → UI shows unauthenticated.
				setUser(null);
			}
		};

		window.addEventListener("pageshow", handlePageShow);
		return () => window.removeEventListener("pageshow", handlePageShow);
	}, [setUser]);

	return null;
}

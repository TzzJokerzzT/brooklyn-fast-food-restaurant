import { COOKIE_KEYS } from "@/src/shared/lib/cookies";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// ── Route Config ────────────────────────────────────────────
// Easily configurable route arrays for auth protection.

const PROTECTED_ROUTES = ["/dashboard"];
const AUTH_ROUTES = ["/login", "/register"];

// ── Middleware ──────────────────────────────────────────────
// Server-side source of truth for route protection.
// Reads the access token from cookies (set by login flow).
//
// Logic:
// - Protected routes (/dashboard/*): redirect to /login if no token
// - Auth routes (/login, /register): redirect to /dashboard if token exists
// - Public routes: pass through

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const accessToken = request.cookies.get(COOKIE_KEYS.access)?.value;
	const isAuthenticated = !!accessToken;

	// ── Protected routes: require authentication ────────────
	if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
		if (!isAuthenticated) {
			const loginUrl = new URL("/login", request.url);
			loginUrl.searchParams.set("from", pathname);
			return NextResponse.redirect(loginUrl);
		}
	}

	// ── Auth routes: redirect if already authenticated ──────
	if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
		if (isAuthenticated) {
			return NextResponse.redirect(new URL("/dashboard", request.url));
		}
	}

	return NextResponse.next();
}

// ── Matcher ────────────────────────────────────────────────
// Only run middleware on relevant routes, not static assets.

export const config = {
	matcher: [
		/*
		 * Match all request paths except:
		 * - _next/static (static files)
		 * - _next/image (image optimization)
		 * - favicon.ico (browser icon)
		 * - public files (images, etc.)
		 */
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};

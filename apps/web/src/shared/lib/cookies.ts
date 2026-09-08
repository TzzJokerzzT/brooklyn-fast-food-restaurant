// ── Cookie Helpers ──────────────────────────────────────────
// httpOnly cookies are set by the backend and can't be read from JS.
// This module only provides a server-side check helper for
// Next.js middleware (which CAN read httpOnly cookies).

// Cookie names used by the backend
export const COOKIE_KEYS = {
	access: "brooklyn_access_token",
	refresh: "brooklyn_refresh_token",
} as const;

import type { ReactNode } from "react";
import SideNavBar from "./SideNavBar";

// ── Dashboard Layout ────────────────────────────────────────
// Shared shell for all dashboard views: sidebar + main content.
// Auth protection is handled by the route layout (app/dashboard/layout.tsx).

export default function DashboardLayout({ children }: { children: ReactNode }) {
	return (
		<div className="flex bg-surface min-h-screen text-on-surface antialiased selection:bg-primary-container selection:text-black">
			{/* Sidebar */}
			<SideNavBar />

			{/* Main Content */}
			<main className="flex-1 md:ml-64 p-gutter md:p-margin-desktop min-h-screen">
				{children}
			</main>
		</div>
	);
}

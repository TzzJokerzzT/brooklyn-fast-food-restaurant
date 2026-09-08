import AuthGuard from "@/src/features/dashboard/shared/components/AuthGuard";
import DashboardLayout from "@/src/features/dashboard/shared/components/DashboardLayout";

// ── Dashboard Layout ────────────────────────────────────────
// Wraps ALL dashboard routes with auth protection and the
// shared dashboard shell (sidebar + main content area).

export default function DashboardRouteLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<AuthGuard>
			<DashboardLayout>{children}</DashboardLayout>
		</AuthGuard>
	);
}

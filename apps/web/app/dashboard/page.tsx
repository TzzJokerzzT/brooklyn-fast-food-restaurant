import DashboardPageView from "@/src/views/DashboardPageView";

import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Dashboard | Brooklyn Fast Food",
	description: "Admin dashboard for Brooklyn Fast Food management",
};

export default function DashboardPage() {
	return <DashboardPageView />;
}

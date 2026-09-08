import type { ReactNode } from "react";
import SideNavBar from "./SideNavBar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
	return (
		<div className="flex bg-surface min-h-screen text-on-surface antialiased selection:bg-primary-container selection:text-black">
			{/* Sidebar */}
			<SideNavBar />

			{/* Main Content */}
			<main className="flex-1 md:ml-64 p-gutter md:p-margin-desktop min-h-screen">
				{/* Header */}
				<header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/20 pb-6">
					<div>
						<h2 className="font-display-xl text-display-xl md:text-display-xl text-on-surface uppercase tracking-tight">
							SYSTEM STATUS
						</h2>
						<p className="font-label-sm text-label-sm text-secondary uppercase tracking-widest mt-2">
							LIVE METRICS — BROOKLYN NODE
						</p>
					</div>
					<div className="font-label-bold text-label-bold flex items-center gap-2 px-4 py-2 bg-black border border-white/20">
						<div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
						SYS.ONLINE
					</div>
				</header>
				{children}
			</main>
		</div>
	);
}

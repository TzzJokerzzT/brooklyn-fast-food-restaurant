"use client";

import ActivePromos from "./ActivePromos";
import LaunchEventForm from "./LaunchEventForm";
import MenuControlTable from "./MenuControlTable";
import StatCard from "./StatCard";

export default function Dashboard() {
	return (
		<>
			{/* Page Header */}
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

			{/* Stats Overview */}
			<section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
				<StatCard
					title="DAILY SALES (USD)"
					value="12,450"
					decimal=".00"
					icon="attach_money"
					trend="+14.2% VS YESTERDAY"
					trendColor="green"
				/>
				<StatCard
					title="ACTIVE PROMOS"
					value="03"
					decimal="/08"
					icon="local_offer"
					subtitle="ALL SYSTEMS NOMINAL"
				/>
				<StatCard
					title="NEXT EVENT DROPPING"
					value="48:12:00"
					icon="timer"
					subtitle='"MIDNIGHT MEAT RUN"'
					highlight
				/>
			</section>

			{/* Bento Grid: Menu Table + Sidebar Widgets */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
				<MenuControlTable />
				<ActivePromos />
			</div>

			{/* Launch Event Form */}
			<div className="mt-6">
				<LaunchEventForm />
			</div>
		</>
	);
}

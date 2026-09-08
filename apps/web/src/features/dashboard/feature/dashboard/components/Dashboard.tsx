"use client";

import DashboardLayout from "../../../shared/components/DashboardLayout";
import ActivePromos from "./ActivePromos";
import LaunchEventForm from "./LaunchEventForm";
import MenuControlTable from "./MenuControlTable";
import StatCard from "./StatCard";

export default function Dashboard() {
	return (
		<DashboardLayout>
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
		</DashboardLayout>
	);
}

"use client";

interface StatCardProps {
	title: string;
	value: string;
	decimal?: string;
	icon: string;
	trend?: string;
	trendColor?: "green" | "secondary" | "mustard";
	subtitle?: string;
	highlight?: boolean;
}

export default function StatCard({
	title,
	value,
	decimal,
	icon,
	trend,
	trendColor = "secondary",
	subtitle,
	highlight = false,
}: StatCardProps) {
	const trendColors = {
		green: "text-green-500",
		secondary: "text-secondary",
		mustard: "text-mustard",
	};

	return (
		<div
			className={`glass-panel p-6 flex flex-col relative overflow-hidden group ${
				highlight ? "bg-mustard/10 border-mustard/30" : ""
			}`}
		>
			{/* Left accent bar */}
			<div
				className={`absolute top-0 left-0 w-1 h-full ${
					highlight
						? "bg-mustard"
						: "bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity"
				}`}
			/>

			{/* Header */}
			<div className="flex justify-between items-start mb-4">
				<span
					className={`font-label-sm text-label-sm uppercase ${
						highlight ? "text-mustard" : "text-secondary"
					}`}
				>
					{title}
				</span>
				<span
					className={`material-symbols-outlined ${highlight ? "text-mustard" : "text-white"}`}
				>
					{icon}
				</span>
			</div>

			{/* Value */}
			<div
				className={`font-headline-lg text-headline-lg mt-auto ${
					highlight ? "text-mustard" : "text-on-surface"
				}`}
			>
				{value}
				{decimal && <span className="text-secondary text-2xl">{decimal}</span>}
			</div>

			{/* Trend or Subtitle */}
			<div className="flex items-center gap-2 mt-2 font-label-bold text-label-bold text-[12px]">
				{trend && (
					<>
						<span
							className={`material-symbols-outlined text-sm ${trendColors[trendColor]}`}
						>
							trending_up
						</span>
						<span className={trendColors[trendColor]}>{trend}</span>
					</>
				)}
				{subtitle && (
					<span
						className={
							highlight ? "text-on-surface uppercase" : "text-secondary"
						}
					>
						{subtitle}
					</span>
				)}
			</div>
		</div>
	);
}

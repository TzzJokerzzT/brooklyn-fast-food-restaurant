"use client";

import BasicAvatar from "@/src/shared/components/ui/BasicAvatar";
import BasicButton from "@/src/shared/components/ui/BasicButton";
import { useLogout } from "@/src/shared/hooks/use-auth";

import { Skeleton } from "@heroui/react";
import { GlobeCheck, LogOut } from "lucide-react";
import Link from "next/link";
import { useDashboardUser } from "../../feature/dashboard/hooks";
import { useProducts } from "../../feature/products";
import useSideNavBar from "../hooks/useSideNavBar";
import { navItems } from "../utils/constant";

export default function SideNavBar() {
	const { isItemActive } = useSideNavBar();
	const { data: user, isLoading } = useDashboardUser();
	const { isLoading: isProductLoading } = useProducts();
	const logout = useLogout();

	return (
		<nav className="hidden md:flex flex-col h-screen fixed left-0 top-0 w-64 border-r border-outline-variant bg-black z-50">
			{/* Logo */}
			<div className="p-6 border-b border-outline-variant">
				<h1 className="font-headline-lg text-headline-lg text-primary leading-none mb-2">
					MANAGEMENT
				</h1>
				<p className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-widest">
					BROOKLYN HQ
				</p>
			</div>

			{/* Admin Profile */}
			<div className="p-6 border-b border-outline-variant flex items-center gap-4">
				{isLoading && isProductLoading ? (
					<div className="flex items-center gap-3">
						<Skeleton className="h-10 w-10 shrink-0 rounded-full" />
						<div className="flex-1 space-y-2">
							<Skeleton className="h-3 w-36 rounded-lg" />
							<Skeleton className="h-3 w-24 rounded-lg" />
						</div>
					</div>
				) : (
					<>
						<div>
							<BasicAvatar className="rounded-[50%]" size="lg">
								{(user?.userName?.charAt(0) ?? "A").toUpperCase() +
									(user?.lastName?.charAt(0) ?? "D").toUpperCase()}
							</BasicAvatar>
						</div>
						<div>
							<p className="font-label-bold text-label-bold text-on-surface uppercase">
								{user?.role?.name}
							</p>
						</div>
					</>
				)}
			</div>

			{/* Navigation */}
			<ul className="flex flex-col flex-grow py-4 overflow-y-auto">
				{navItems.map((item) => {
					const isActive = isItemActive(item);

					return (
						<li key={item.label} className="px-4 py-1">
							{isLoading && isProductLoading ? (
								<div className="flex items-center gap-3">
									<Skeleton className="h-10 w-10 shrink-0 rounded-full" />
									<div className="flex-1 space-y-2">
										<Skeleton className="h-3 w-36 rounded-lg" />
										<Skeleton className="h-3 w-24 rounded-lg" />
									</div>
								</div>
							) : (
								<BasicButton
									className={`flex items-center gap-4 px-4 py-3 transition-all w-full text-foreground ${
										isActive
											? "bg-primary text-on-primary font-bold"
											: "bg-transparent text-on-surface-variant hover:bg-mustard/10 border border-transparent hover:border-mustard/20"
									}`}
								>
									<Link
										href={item.href}
										className={`flex items-center gap-4 px-4 py-3 transition-all w-full`}
									>
										<span
											className="material-symbols-outlined"
											style={{
												fontVariationSettings: isActive
													? "'FILL' 1"
													: "'FILL' 0",
											}}
										>
											{item.icon}
										</span>
										<span className="font-label-bold text-label-bold">
											{item.label}
										</span>
									</Link>
								</BasicButton>
							)}
							{/* )} */}
						</li>
					);
				})}
			</ul>

			{/* Footer Actions */}
			<div className="p-6 border-t border-outline-variant mt-auto flex flex-col gap-2">
				<BasicButton>
					<Link
						href="/"
						target="_blank"
						className="btn-secondary w-full flex items-center justify-center gap-2 text-foreground"
					>
						<GlobeCheck size={16} />
						Ver Sitio Web
					</Link>
				</BasicButton>
				<BasicButton
					className="flex items-center justify-center gap-2 w-full py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 rounded-xl transition-colors"
					onPress={logout}
				>
					<LogOut size={16} />
					<span className="font-label-bold text-label-bold">Cerrar Sesión</span>
				</BasicButton>
			</div>
		</nav>
	);
}

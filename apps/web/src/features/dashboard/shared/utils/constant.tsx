import {
	Calendar,
	Hamburger,
	HandCoins,
	Percent,
	SquareDashedText,
	User,
} from "lucide-react";
import type { NavItem } from "../types/SideBar";
import type { TableHeader } from "../types/Table";

export const navItems: NavItem[] = [
	{ label: "DASHBOARD", href: "/dashboard", icon: <SquareDashedText /> },
	{
		label: "PRODUCTS",
		href: "/dashboard/products",
		icon: <Hamburger size={16} />,
	},
	{
		label: "PRICING",
		href: "/dashboard/pricing",
		icon: <HandCoins size={16} />,
	},
	{ label: "PROMOS", href: "/dashboard/promos", icon: <Percent size={16} /> },
	{ label: "EVENTS", href: "/dashboard/events", icon: <Calendar size={16} /> },
	{ label: "PERFIL", href: "/dashboard/events", icon: <User size={16} /> },
];

export const tableHeaders: TableHeader[] = [
	{ label: "Producto", key: "products" },
	{ label: "Precio", key: "price" },
	{ label: "Ingredientes", key: "ingredients" },
	{ label: "Promoción", key: "promotions" },
	{ label: "Acciones", key: "actions" },
];

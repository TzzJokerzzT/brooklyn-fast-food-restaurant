import { usePathname } from "next/navigation";
import { useState } from "react";
import type { NavItem } from "../types/SideBar";

export default function useSideNavBar() {
	const pathname = usePathname();
	const [expandedItems, setExpandedItems] = useState<string[]>(["PRODUCTS"]);

	const toggleExpanded = (label: string) => {
		setExpandedItems((prev) =>
			prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
		);
	};

	const isItemActive = (item: NavItem): boolean => {
		if (item.href) return pathname === item.href;
		if (item.children && item.children.length > 0) {
			return item.children.some((child) => pathname === child.href);
		}
		return false;
	};

	const isSubItemActive = (href: string): boolean => pathname === href;

	return {
		toggleExpanded,
		isItemActive,
		isSubItemActive,
		expandedItems,
	};
}

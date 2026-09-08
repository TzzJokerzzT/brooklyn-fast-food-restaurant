import type { ReactNode } from "react";

export interface NavSubItem {
	label: string;
	href: string;
	icon: ReactNode;
}

export interface NavItem {
	label: string;
	href: string;
	icon: ReactNode;
	children?: NavSubItem[];
}

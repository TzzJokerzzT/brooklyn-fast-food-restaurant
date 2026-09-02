import type { ReactNode } from "react";

export interface BasicButtonProps {
	children: ReactNode;
	variant?:
		| "primary"
		| "secondary"
		| "tertiary"
		| "outline"
		| "ghost"
		| "danger";
	isDisabled?: boolean;
	isIconOnly?: boolean;
	isPending?: boolean;
	onPress?: () => void;
	type?: "button" | "submit" | "reset";
	className?: string;
}

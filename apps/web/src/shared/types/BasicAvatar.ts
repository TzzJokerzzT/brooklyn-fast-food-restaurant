import type { ReactNode } from "react";

export interface BasicAvatarProps {
	children?: ReactNode;
	size?: "lg" | "md" | "sm";
	className?: string;
	variant?: "default" | "soft";
	isImage?: boolean;
	src?: string;
	alt?: string;
}

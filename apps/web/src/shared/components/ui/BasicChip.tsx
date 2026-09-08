import { Chip } from "@heroui/react";
import type { ReactNode } from "react";

export interface BasicChipProps {
	children: ReactNode;
	icon?: ReactNode;
	variant?: "primary" | "secondary" | "tertiary" | "soft";
	className?: string;
	size?: "lg" | "md" | "sm";
	onClick?: () => void;
}

export default function BasicChip({
	children,
	icon,
	variant,
	className,
	size = "md",
	onClick,
}: BasicChipProps) {
	const Tag = onClick ? "button" : "div";

	return (
		<Tag
			onClick={onClick}
			type={onClick ? "button" : undefined}
			className="appearance-none border-none bg-transparent p-0 cursor-default"
		>
			<Chip className={className} variant={variant} size={size}>
				{icon}
				<Chip.Label>{children}</Chip.Label>
			</Chip>
		</Tag>
	);
}

import { Spinner } from "@heroui/react";

export interface BasicSpinnerProps {
	children?: React.ReactNode;
	size?: "sm" | "md" | "lg" | "xl";
	className?: string;
}

export default function BasicSpinner({
	children,
	size = "md",
	className = "text-mustard",
}: BasicSpinnerProps) {
	return (
		<>
			<Spinner size={size} className={className} />
			{children}
		</>
	);
}

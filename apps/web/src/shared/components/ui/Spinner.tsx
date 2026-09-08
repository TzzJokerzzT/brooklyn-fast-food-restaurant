import type { ReactNode } from "react";

interface SpinnerProps {
	children?: ReactNode;
	className?: string;
}

export default function Spinner({ children, className = "" }: SpinnerProps) {
	return (
		<div
			className={`flex flex-col items-center justify-center gap-3 ${className}`}
		>
			<div className="w-8 h-8 border-2 border-white/20 border-t-mustard rounded-full animate-spin" />
			{children}
		</div>
	);
}

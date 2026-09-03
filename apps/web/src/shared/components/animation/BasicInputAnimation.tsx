import { motion } from "motion/react";
import type { ReactNode } from "react";

export default function BasicInputAnimation({
	children,
	duration = 0.35,
}: {
	children: ReactNode;
	duration: number;
}) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 16 }}
			animate={{
				opacity: 1,
				y: 0,
			}}
			transition={{ duration: duration, ease: [0.22, 1, 0.36, 1] }}
		>
			{children}
		</motion.div>
	);
}

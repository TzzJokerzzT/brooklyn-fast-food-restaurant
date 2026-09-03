"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import LazyMotionComponent from "./LazyMotionComponent";

const containerVariants: Variants = {
	hidden: { opacity: 0, y: 16 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			staggerChildren: 0.08,
			delayChildren: 0.1,
			duration: 0.5,
		},
	},
};
export default function FormEnterAnimation({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<LazyMotionComponent>
			<motion.div
				variants={containerVariants}
				initial="hidden"
				animate="visible"
			>
				{children}
			</motion.div>
		</LazyMotionComponent>
	);
}

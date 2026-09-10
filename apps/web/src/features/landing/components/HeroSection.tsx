"use client";

import LazyMotionComponent from "@/src/shared/components/animation/LazyMotionComponent";

import { motion } from "motion/react";
import BackgroundImage from "./BackgroundImage";
import ContentSection from "./ContentSection";

export default function HeroSection() {
	return (
		<section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-[var(--gutter)] pt-24">
			{/* Background image overlay */}
			<BackgroundImage />

			{/* Content */}
			<LazyMotionComponent>
				<motion.div
					initial={{ opacity: 0, y: 16 }}
					animate={{
						opacity: 1,
						y: 0,
					}}
					transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
				>
					<ContentSection />
				</motion.div>
			</LazyMotionComponent>
		</section>
	);
}

import { domAnimation, LazyMotion } from "motion/react";
import type { ReactNode } from "react";

export default function LazyMotionComponent({
	children,
}: {
	children: ReactNode;
}) {
	return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}

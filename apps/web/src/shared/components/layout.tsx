"use client";

import type { ReactNode } from "react";
import Footer from "./Footer";
import Header from "./Header";

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<>
			<Header />
			<main className="w-full h-full">{children}</main>
			<Footer />
		</>
	);
}

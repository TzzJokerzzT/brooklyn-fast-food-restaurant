"use client";

import FormEnterAnimation from "@/src/shared/components/animation/FormEnterAnimation";
import { useAuthStore } from "@/src/shared/store/auth.store";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoginForm from "./LoginForm";

export default function Login() {
	const router = useRouter();
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
	const [isReady, setIsReady] = useState(false);

	// Wait for Zustand rehydration before checking auth state
	useEffect(() => {
		const timer = setTimeout(() => setIsReady(true), 0);
		return () => clearTimeout(timer);
	}, []);

	// If already authenticated, redirect away from login
	useEffect(() => {
		if (isReady && isAuthenticated) {
			router.replace("/");
		}
	}, [isReady, isAuthenticated, router]);

	// Still rehydrating or redirecting
	if (!isReady || isAuthenticated) {
		return null;
	}

	return (
		<FormEnterAnimation>
			<LoginForm />
		</FormEnterAnimation>
	);
}

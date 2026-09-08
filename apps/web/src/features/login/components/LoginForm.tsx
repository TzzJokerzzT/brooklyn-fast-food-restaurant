"use client";

import BasicButton from "@/src/shared/components/ui/BasicButton";
import { useLogin } from "@/src/shared/hooks/use-auth";

import Link from "next/link";
import type { FormEvent } from "react";
import LoginFields from "./LoginFields";

// ── Login Form ──────────────────────────────────────────────
// Uses shared useLogin hook which handles redirect + cache on success.
// Global QueryClient onError handles error toast.

export default function LoginForm() {
	const { mutateAsync, isPending } = useLogin();

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);

		try {
			await mutateAsync({
				email: formData.get("email") as string,
				password: formData.get("password") as string,
			});
		} catch {
			// Error toast already shown by global QueryClient onError
		}
	};

	return (
		<section
			id="login"
			className="w-full bg-black py-20 px-4 border-t border-zinc-900"
		>
			<div className="max-w-md mx-auto bg-zinc-950 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
				<div className="flex items-center justify-between mb-8 pb-3 border-b border-zinc-800">
					<h2 className="text-3xl font-black tracking-tighter text-white uppercase font-sans">
						Iniciar Sesión
					</h2>
				</div>

				<form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded">
					<LoginFields />

					<BasicButton
						type="submit"
						isDisabled={isPending}
						isPending={isPending}
						className="w-full py-3 bg-mustard text-black font-bold uppercase tracking-wider hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						{isPending ? "Ingresando..." : "Entrar"}
					</BasicButton>
				</form>

				<p className="mt-4 text-zinc-400 text-sm">
					¿No tienes una cuenta?{" "}
					<Link
						href="/register"
						className="text-white underline hover:text-zinc-300"
					>
						Regístrate aquí
					</Link>
				</p>
			</div>
		</section>
	);
}

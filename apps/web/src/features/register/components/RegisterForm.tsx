"use client";

import BasicButton from "@/src/shared/components/ui/BasicButton";

import Link from "next/link";
import type { FormEvent } from "react";
import { useRegister } from "../hooks";
import RegisterFields from "./RegisterFields";

// ── Register Form ────────────────────────────────────────
// Simplified: hook handles redirect + cache on success,
// global QueryClient onError handles error toast.

export default function RegisterForm() {
	const { mutateAsync, isPending } = useRegister();

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);

		try {
			await mutateAsync({
				userName: formData.get("userName") as string,
				lastName: formData.get("lastName") as string,
				email: formData.get("email") as string,
				password: formData.get("password") as string,
				address: (formData.get("address") as string) || undefined,
				phoneNumber: formData.get("phoneNumber") as string,
			});
		} catch {
			// Error toast already shown by global QueryClient onError
		}
	};

	return (
		<section
			id="registro"
			className="w-full bg-black py-20 px-4 border-t border-zinc-900 "
		>
			<div className="max-w-md mx-auto bg-zinc-950 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
				<div className="flex items-center justify-between mb-8 pb-3 border-b border-zinc-800">
					<h2 className="text-3xl font-black tracking-tighter text-white uppercase font-sans">
						Registrarse
					</h2>
				</div>

				<form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded">
					<RegisterFields />

					<BasicButton
						type="submit"
						isDisabled={isPending}
						isPending={isPending}
						className="w-full py-3 bg-mustard text-black font-bold uppercase tracking-wider hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						{isPending ? "Registrando..." : "Crear cuenta"}
					</BasicButton>
				</form>

				<p className="mt-4 text-zinc-400 text-sm">
					Si ya tienes una cuenta creada con nosotros entra{" "}
					<Link
						href="/login"
						className="text-white underline hover:text-zinc-300"
					>
						aquí
					</Link>
				</p>
			</div>
		</section>
	);
}

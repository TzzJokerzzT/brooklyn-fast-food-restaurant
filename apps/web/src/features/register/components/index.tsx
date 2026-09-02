"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useRegister } from "../hooks";
import RegisterFields from "./RegisterFields";

// ── Register Form ────────────────────────────────────────

export default function RegisterForm() {
	const router = useRouter();
	const { mutateAsync, isPending } = useRegister();
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError("");

		const formData = new FormData(e.currentTarget);

		try {
			await mutateAsync({
				userName: formData.get("userName") as string,
				lastName: formData.get("lastName") as string,
				email: formData.get("email") as string,
				password: formData.get("password") as string,
				address: (formData.get("address") as string) || undefined,
			});

			router.push("/");
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Error al registrar usuario",
			);
		}
	};

	return (
		<section
			id="registro"
			className="w-full bg-black py-20 px-4 border-t border-zinc-900"
		>
			<div className="max-w-md mx-auto bg-zinc-950 border border-zinc-800 p-8 shadow-2xl">
				<div className="flex items-center justify-between mb-8 pb-3 border-b border-zinc-800">
					<h2 className="text-3xl font-black tracking-tighter text-white uppercase font-sans">
						Registrarse
					</h2>
				</div>

				{error && (
					<div className="mb-4 p-3 bg-red-950 border border-red-800 text-red-200 text-sm rounded">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="flex flex-col gap-5">
					<RegisterFields />

					<button
						type="submit"
						disabled={isPending}
						className="w-full py-3 bg-white text-black font-bold uppercase tracking-wider hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						{isPending ? "Registrando..." : "Crear cuenta"}
					</button>
				</form>

				<p className="mt-4 text-zinc-400 text-sm">
					Si ya tienes una cuenta creada con nosotros entra{" "}
					<Link href="/login" className="text-white underline hover:text-zinc-300">
						aquí
					</Link>
				</p>
			</div>
		</section>
	);
}

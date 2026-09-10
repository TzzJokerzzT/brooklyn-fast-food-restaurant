"use client";

import { useProductsList } from "../hooks/product";
import ProductCard from "./ProductCard";

export default function MenuSection() {
	const { data: products, isLoading } = useProductsList({ limit: 50 });

	if (isLoading || !products?.products?.length) {
		return null;
	}

	return (
		<section
			className="py-16 px-[var(--gutter)] max-w-[var(--container-max)] mx-auto"
			id="menu"
		>
			<div className="flex flex-col gap-4 mb-16">
				<h2 className="text-4xl md:text-6xl uppercase text-accent">
					LATE NIGHT HITS
				</h2>
				<p className="text-sm font-bold text-muted uppercase tracking-widest">
					{/* THE ESSENTIALS */}
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				<ProductCard products={products.products} />
			</div>
		</section>
	);
}

import BasicButton from "@/src/shared/components/ui/BasicButton";
import type { ProductResponse } from "@/src/shared/types/services/product";

import { Card } from "@heroui/react";
import Image from "next/image";

interface ProductCardProps {
	products: ProductResponse[];
}

export default function ProductCard({ products }: ProductCardProps) {
	return (
		<>
			{products.map((item) => (
				<article
					key={item.id}
					className="relative overflow-hidden transition-all duration-300 hover:border-accent hover:scale-[1.02]"
				>
					<Card className="p-0 m-0 relative w-full max-w-md overflow-hidden border border-accent/20 bg-linear-to-br from-accent/12 via-surface to-surface-secondary shadow-lg shadow-accent/10 dark:border-accent/30 dark:from-accent/20 dark:via-surface dark:to-accent/8 dark:shadow-accent/5">
						<div
							aria-hidden="true"
							className="pointer-events-none absolute -top-12 -right-12 size-40 rounded-full bg-accent/20 blur-3xl dark:bg-accent/30"
						/>
						<div
							aria-hidden="true"
							className="pointer-events-none absolute -bottom-8 -left-8 size-28 rounded-full bg-accent/10 blur-2xl dark:bg-accent/20"
						/>
						<Card.Header className="mb-0">
							<Image
								className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
								alt={item.productName}
								src={item.productImage || ""}
								width={200}
								height={200}
								loading="eager"
							/>
						</Card.Header>

						<Card.Content className="relative">
							<div className="p-6 flex flex-col gap-4">
								<div className="flex justify-between items-start">
									<h3 className="text-lg uppercase">{item.productName}</h3>
									<span className="font-bold text-accent text-xl">
										{item.price}
									</span>
								</div>
								<p className="text-sm text-muted min-h-[48px]">
									{item.ingredients}
								</p>
							</div>
						</Card.Content>
						<Card.Footer className="relative flex-col gap-2 sm:flex-row mb-4">
							<BasicButton className="w-full shadow-md shadow-accent/20 ml-3">
								Upgrade now
							</BasicButton>
							<BasicButton className="w-full mr-3" variant="secondary">
								Compare plans
							</BasicButton>
						</Card.Footer>
					</Card>
				</article>
			))}
		</>
	);
}

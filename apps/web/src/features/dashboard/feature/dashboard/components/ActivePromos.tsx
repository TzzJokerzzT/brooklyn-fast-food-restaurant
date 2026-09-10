"use client";

interface Promo {
	code: string;
	description: string;
	expiresIn?: string;
	usage: number;
	highlight?: boolean;
}

const promos: Promo[] = [
	{
		code: "BOGO-MIDNIGHT",
		description: "Buy 1 Bruiser, Get 1 Free Fries after 11 PM.",
		expiresIn: "ENDS IN 2H",
		usage: 245,
		highlight: true,
	},
	{
		code: "NEW-USER-20",
		description: "20% off first digital order.",
		expiresIn: "ONGOING",
		usage: 1892,
		highlight: false,
	},
];

export default function ActivePromos() {
	return (
		<section className="lg:col-span-4 flex flex-col gap-6">
			<div className="glass-panel p-6 flex flex-col">
				{/* Header */}
				<div className="flex justify-between items-center mb-6">
					<h3 className="font-headline-lg-mobile text-headline-lg-mobile uppercase text-on-surface">
						ACTIVE PROMOS
					</h3>
					<span className="material-symbols-outlined text-mustard">
						local_fire_department
					</span>
				</div>

				{/* Promo List */}
				<div className="space-y-4">
					{promos.map((promo) => (
						<div
							key={promo.code}
							className={`p-4 bg-black border relative overflow-hidden group ${
								promo.highlight ? "border-mustard" : "border-white/20"
							}`}
						>
							<div className="absolute inset-0 bg-mustard/5 opacity-0 group-hover:opacity-100 transition-opacity" />
							<div className="flex justify-between items-start mb-2">
								<span
									className={`font-label-bold text-label-bold px-2 py-1 text-[10px] ${
										promo.highlight
											? "bg-mustard text-black"
											: "bg-white text-black"
									}`}
								>
									{promo.code}
								</span>
								<span className="font-label-sm text-label-sm text-secondary">
									{promo.expiresIn}
								</span>
							</div>
							<p className="font-body-md text-body-md uppercase">
								{promo.description}
							</p>
							<div className="mt-4 flex justify-between items-center border-t border-white/10 pt-2">
								<span className="font-label-sm text-label-sm text-secondary">
									USAGE: {promo.usage.toLocaleString()}
								</span>
								<button className="text-red-500 font-label-bold text-label-bold text-[10px] hover:underline">
									TERMINATE
								</button>
							</div>
						</div>
					))}
				</div>

				{/* New Promo Button */}
				<button className="btn-secondary mt-6 w-full text-sm">
					NEW PROMO CODE
				</button>
			</div>
		</section>
	);
}

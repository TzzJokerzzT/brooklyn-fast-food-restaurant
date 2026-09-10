"use client";

interface MenuItem {
	id: string;
	name: string;
	price: string;
	status: "active" | "hidden";
	icon: string;
	featured: boolean;
}

const menuItems: MenuItem[] = [
	{
		id: "#BRG-01",
		name: "THE BROOKLYN BRUISER",
		price: "$14.50",
		status: "active",
		icon: "lunch_dining",
		featured: true,
	},
	{
		id: "#BRG-02",
		name: "CONCRETE JUNGLE VEGAN",
		price: "$16.00",
		status: "active",
		icon: "lunch_dining",
		featured: false,
	},
	{
		id: "#FRY-01",
		name: "TRUFFLE DUST FRIES",
		price: "$8.50",
		status: "hidden",
		icon: "downloading",
		featured: false,
	},
	{
		id: "#DRK-02",
		name: "TOXIC SLUDGE SHAKE",
		price: "$9.00",
		status: "active",
		icon: "local_drink",
		featured: true,
	},
];

export default function MenuControlTable() {
	return (
		<section className="lg:col-span-8 glass-panel flex flex-col">
			{/* Header */}
			<div className="p-6 border-b border-white/20 flex justify-between items-center bg-black/40">
				<h3 className="font-display-xl-mobile text-display-xl-mobile uppercase text-on-surface">
					MENU CTRL
				</h3>
				<button className="btn-secondary py-2 px-4 text-sm flex items-center gap-2">
					<span className="material-symbols-outlined text-sm">add</span> ADD
					ITEM
				</button>
			</div>

			{/* Table */}
			<div className="overflow-x-auto">
				<table className="w-full text-left border-collapse">
					<thead>
						<tr className="border-b border-white/20 bg-surface-container-low font-label-sm text-label-sm text-secondary uppercase tracking-widest">
							<th className="p-4 font-normal">ITEM_ID</th>
							<th className="p-4 font-normal">NAME</th>
							<th className="p-4 font-normal">PRICE</th>
							<th className="p-4 font-normal text-center">STATUS</th>
							<th className="p-4 font-normal text-center">FEATURED</th>
							<th className="p-4 font-normal text-right">ACT</th>
						</tr>
					</thead>
					<tbody className="font-label-bold text-label-bold">
						{menuItems.map((item) => (
							<tr
								key={item.id}
								className={`border-b border-white/10 hover:bg-white/5 transition-colors group ${
									item.status === "hidden" ? "opacity-50" : ""
								}`}
							>
								<td className="p-4 text-secondary">{item.id}</td>
								<td className="p-4">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 bg-black border border-white/20 flex items-center justify-center">
											<span className="material-symbols-outlined text-secondary">
												{item.icon}
											</span>
										</div>
										<span className="uppercase">{item.name}</span>
									</div>
								</td>
								<td className="p-4 font-label-sm text-label-sm text-mustard">
									{item.price}
								</td>
								<td className="p-4 text-center">
									<span
										className={`inline-block px-2 py-1 border text-[10px] uppercase tracking-wider ${
											item.status === "active"
												? "bg-green-500/20 text-green-500 border-green-500/50"
												: "bg-red-500/20 text-red-500 border-red-500/50"
										}`}
									>
										{item.status === "active"
											? "ACTIVE"
											: "HIDDEN (OUT OF STOCK)"}
									</span>
								</td>
								<td className="p-4 text-center">
									<div
										className={`relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in ${
											item.status === "hidden"
												? "opacity-50 pointer-events-none"
												: ""
										}`}
									>
										<input
											type="checkbox"
											defaultChecked={item.featured}
											className="toggle-checkbox absolute block w-5 h-5 rounded-none bg-black border-2 border-white/40 appearance-none cursor-pointer z-10 top-0 left-0 transition-transform duration-200 ease-in-out translate-x-5 checked:border-mustard checked:bg-mustard"
										/>
										<label className="toggle-label block overflow-hidden h-5 bg-white/10 cursor-pointer border border-white/20 transition-colors duration-200" />
									</div>
								</td>
								<td className="p-4 text-right">
									<button className="text-secondary hover:text-white">
										<span className="material-symbols-outlined">edit</span>
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</section>
	);
}

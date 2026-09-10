"use client";

export default function LaunchEventForm() {
	return (
		<div className="glass-panel p-6 flex flex-col">
			<h3 className="font-headline-lg-mobile text-headline-lg-mobile uppercase text-on-surface mb-6 border-b border-white/20 pb-2">
				LAUNCH EVENT
			</h3>
			<form className="space-y-6">
				<div className="relative">
					<label className="font-label-sm text-label-sm text-secondary uppercase block mb-1">
						EVENT NAME
					</label>
					<input
						className="input-industrial"
						placeholder="e.g. FLASH DROP: SPICY AF"
						type="text"
					/>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<div className="relative">
						<label className="font-label-sm text-label-sm text-secondary uppercase block mb-1">
							DATE
						</label>
						<input
							className="input-industrial"
							placeholder="MM/DD/YYYY"
							type="text"
						/>
					</div>
					<div className="relative">
						<label className="font-label-sm text-label-sm text-secondary uppercase block mb-1">
							TIME
						</label>
						<input
							className="input-industrial"
							placeholder="HH:MM (24H)"
							type="text"
						/>
					</div>
				</div>
				<button
					className="btn-primary w-full flex justify-center items-center gap-2"
					type="button"
				>
					<span className="material-symbols-outlined">rocket_launch</span>{" "}
					DEPLOY
				</button>
			</form>
		</div>
	);
}

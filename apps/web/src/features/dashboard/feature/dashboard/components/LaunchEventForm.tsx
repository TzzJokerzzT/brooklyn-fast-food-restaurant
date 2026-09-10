"use client";

import BasicInput from "@/src/shared/components/BasicInput";

export default function LaunchEventForm() {
	return (
		<div className="glass-panel p-6 flex flex-col">
			<h3 className="font-headline-lg-mobile text-headline-lg-mobile uppercase text-on-surface mb-6 border-b border-white/20 pb-2">
				LAUNCH EVENT
			</h3>
			<form className="space-y-6">
				<div className="relative">
					<BasicInput
						labelText="Nombre del evento"
						placeholderText="Nombre del evento"
						name="event-name"
					/>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<div className="relative">
						<BasicInput
							type="date"
							labelText="Fecha del evento"
							placeholderText="Fecha del evento"
							name="event-date"
						/>
					</div>
					<div className="relative">
						<BasicInput
							type="hour"
							labelText="Hora del evento"
							placeholderText="Hora del evento"
							name="event-hour"
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

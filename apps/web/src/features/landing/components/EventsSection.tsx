import { Button } from "@heroui/react";

export default function EventsSection() {
	return (
		<section
			className="py-16 px-[var(--gutter)] max-w-[var(--container-max)] mx-auto relative"
			id="events"
		>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
				{/* Text Content */}
				<div className="flex flex-col gap-8 order-2 lg:order-1">
					<div className="flex flex-col gap-2">
						<p className="text-sm font-bold text-accent uppercase tracking-widest flex items-center gap-2">
							<span className="w-8 h-[2px] bg-accent inline-block" />
							LIVE EVENT
						</p>
						<h2 className="text-4xl md:text-6xl uppercase leading-none">
							WEEKEND
							<br />
							TAKEOVER
						</h2>
					</div>

					<div className="bg-surface p-8 border-l-4 border-accent">
						<h3 className="text-xl uppercase mb-2 text-white">
							MIDNIGHT MEAT RUN
						</h3>
						<p className="text-sm text-muted mb-6">
							Join us this Friday at 11 PM. Limited edition street cuts, live DJ
							set by DJ Grit, and exclusive merch drops. Once the meat is gone,
							it&apos;s gone.
						</p>

						{/* Countdown */}
						<div className="grid grid-cols-4 gap-4 text-center border-t border-white/20 pt-6">
							<div>
								<span className="block text-2xl text-accent">02</span>
								<span className="text-xs uppercase text-muted/60">DAYS</span>
							</div>
							<div>
								<span className="block text-2xl text-accent">14</span>
								<span className="text-xs uppercase text-muted/60">HOURS</span>
							</div>
							<div>
								<span className="block text-2xl text-accent">45</span>
								<span className="text-xs uppercase text-muted/60">MINS</span>
							</div>
							<div>
								<span className="block text-2xl text-accent">12</span>
								<span className="text-xs uppercase text-muted/60">SECS</span>
							</div>
						</div>
					</div>

					<Button className="bg-accent text-accent-foreground font-bold uppercase px-8 py-4 w-fit hover:bg-white hover:text-black transition-all duration-300">
						RSVP NOW
					</Button>
				</div>

				{/* Image */}
				<div className="order-1 lg:order-2 relative aspect-square w-full max-w-md mx-auto lg:max-w-none">
					<div className="absolute inset-0 bg-accent transform translate-x-4 translate-y-4" />
					<img
						className="relative z-10 w-full h-full object-cover grayscale border-2 border-white"
						alt="Brooklyn street food event"
						src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvvGavNkYv9KSsmkbkYRKG8j7_gAOIJTKhsmaDrQQ-cPMniQh4RoHeSsevtfRaWGg4LnD2bpw6U0IYaQvy7_KRzcdpuSKFrGaJCx84nkfpAuwyQmKSwQLqKyloDH_gpoqf8z58jXygny7JgHgdwqBpg0tvMYQYltlRmB1RyHCT-hsTsDBaKlvYrGAg2gtkkX-65Har9I3xAd_T_0X7Fo_5tdRjqkk3R_1IvA8NN38kRZ5fYPwZEh2p"
					/>
				</div>
			</div>
		</section>
	);
}

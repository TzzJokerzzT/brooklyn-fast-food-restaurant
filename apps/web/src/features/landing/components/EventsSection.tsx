import { Button } from "@heroui/react";

export default function EventsSection() {
	return (
		<section
			className="relative mx-auto max-w-[var(--container-max)] px-[var(--gutter)] py-16"
			id="events"
		>
			<div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
				{/* Text Content */}
				<div className="order-2 flex flex-col gap-8 lg:order-1">
					<div className="flex flex-col gap-2">
						<p className="flex items-center gap-2 text-sm font-bold tracking-widest text-accent uppercase">
							<span className="inline-block h-[2px] w-8 bg-accent" />
							LIVE EVENT
						</p>
						<h2 className="text-4xl leading-none uppercase md:text-6xl">
							WEEKEND
							<br />
							TAKEOVER
						</h2>
					</div>

					<div className="border-l-4 border-accent bg-surface p-8">
						<h3 className="mb-2 text-xl text-white uppercase">
							MIDNIGHT MEAT RUN
						</h3>
						<p className="mb-6 text-sm text-muted">
							Join us this Friday at 11 PM. Limited edition street cuts, live DJ
							set by DJ Grit, and exclusive merch drops. Once the meat is gone,
							it&apos;s gone.
						</p>

						{/* Countdown */}
						<div className="grid grid-cols-4 gap-4 border-t border-white/20 pt-6 text-center">
							<div>
								<span className="block text-2xl text-accent">02</span>
								<span className="text-xs text-muted/60 uppercase">DAYS</span>
							</div>
							<div>
								<span className="block text-2xl text-accent">14</span>
								<span className="text-xs text-muted/60 uppercase">HOURS</span>
							</div>
							<div>
								<span className="block text-2xl text-accent">45</span>
								<span className="text-xs text-muted/60 uppercase">MINS</span>
							</div>
							<div>
								<span className="block text-2xl text-accent">12</span>
								<span className="text-xs text-muted/60 uppercase">SECS</span>
							</div>
						</div>
					</div>

					<Button className="w-fit bg-accent px-8 py-4 font-bold text-accent-foreground uppercase transition-all duration-300 hover:bg-white hover:text-black">
						RSVP NOW
					</Button>
				</div>

				{/* Image */}
				<div className="relative order-1 mx-auto aspect-square w-full max-w-md lg:order-2 lg:max-w-none">
					<div className="absolute inset-0 translate-x-4 translate-y-4 transform bg-accent" />
					<img
						className="relative z-10 h-full w-full border-2 border-white object-cover grayscale"
						alt="Brooklyn street food event"
						src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvvGavNkYv9KSsmkbkYRKG8j7_gAOIJTKhsmaDrQQ-cPMniQh4RoHeSsevtfRaWGg4LnD2bpw6U0IYaQvy7_KRzcdpuSKFrGaJCx84nkfpAuwyQmKSwQLqKyloDH_gpoqf8z58jXygny7JgHgdwqBpg0tvMYQYltlRmB1RyHCT-hsTsDBaKlvYrGAg2gtkkX-65Har9I3xAd_T_0X7Fo_5tdRjqkk3R_1IvA8NN38kRZ5fYPwZEh2p"
					/>
				</div>
			</div>
		</section>
	);
}

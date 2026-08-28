import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
	return (
		<section className="relative min-h-screen flex flex-col justify-center items-center pt-24 px-[var(--gutter)] overflow-hidden">
			{/* Background image overlay */}
			<div className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity">
				<Image
					className="w-full h-full object-cover"
					alt="Brooklyn street food atmosphere"
					src="https://lh3.googleusercontent.com/aida-public/AB6AXuAI0Nh1JzJaDAjklwFMNjhmjNJjf3nEUEBSBRohjt55YbbYdGyCFnkEiHdcdLcYammsMMNlzU7fy3u10xKPU8MQskmCcdq96AFJysr8PvZ24FMsIr5TYWgonuhE_RosbfT7tFefEiNNaxWlUZk3Khk0PgoLq2H6hqsgZ7Rc3R3vpNWbwBTrYa3bcd2cOvd3WZ-ScWB9_AxJz3ogglPm9nkS8rM_NVzTR5tD7epd6Qzdb0w-Z-GvlCuC"
					width={200}
					height={200}
					loading="eager"
				/>
			</div>

			{/* Content */}
			<div className="relative z-10 max-w-[var(--container-max)] w-full flex flex-col items-start gap-8 md:mt-32">
				<h1 className="text-5xl md:text-[120px] md:leading-[110px] text-white uppercase max-w-4xl tracking-tighter drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
					RAW.
					<br />
					FAST.
					<br />
					<span className="text-accent">AUTHENTIC.</span>
				</h1>

				<p className="text-lg text-foreground max-w-xl bg-black/50 p-4 border-l-4 border-accent">
					Straight from the streets of Brooklyn. No compromises, just
					unapologetic flavor hitting you at 100mph. We own the night.
				</p>

				<div className="flex flex-col sm:flex-row gap-6 mt-4">
					<Link
						className="bg-accent text-accent-foreground font-bold uppercase px-8 py-4 text-center hover:bg-white hover:text-black transition-all duration-300"
						href="#menu"
					>
						VIEW MENU
					</Link>
					<Link
						className="bg-transparent border-2 border-white text-white font-bold uppercase px-8 py-4 text-center hover:bg-white hover:text-black transition-all duration-300"
						href="#order"
					>
						ORDER NOW
					</Link>
				</div>
			</div>
		</section>
	);
}

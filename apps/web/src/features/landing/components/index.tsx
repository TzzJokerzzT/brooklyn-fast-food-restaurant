import Layout from "@/src/shared/components/layout";

import EventsSection from "./EventsSection";
import HeroSection from "./HeroSection";
import MenuSection from "./MenuSection";

export default function LandingPage() {
	return (
		<Layout>
			<HeroSection />

			{/* Divider */}
			<div className="w-full h-[2px] bg-white opacity-20" />

			<MenuSection />

			{/* Divider */}
			<div className="w-full h-[2px] bg-accent" />

			<EventsSection />
		</Layout>
	);
}

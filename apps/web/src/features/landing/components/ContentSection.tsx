import BasicButton from "@/src/shared/components/ui/BasicButton";

import Image from "next/image";
import Link from "next/link";

export default function ContentSection() {
	return (
		<div className="relative z-10 flex w-full max-w-[var(--container-max)] flex-col items-start gap-8 md:mt-32">
			<Image
				src="/logo.png"
				alt="Brooklyn Restaurant Logo"
				width={200}
				height={200}
				className="mx-auto aspect-auto w-40 bg-transparent mix-blend-screen invert md:w-52 lg:w-56 xl:w-60"
			/>
			<h1 className="max-w-4xl text-5xl tracking-tighter text-white uppercase drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] md:text-[120px] md:leading-[110px]">
				Disfruta del autentico estilo neoyorquino
				<span className="text-acdisfruta del estilo neoyorquinocent">
					AUTHENTIC.
				</span>
			</h1>

			<p className="max-w-xl border-l-4 border-accent bg-black/50 p-4 text-lg text-foreground">
				Un lugar donde podras vivir experiencias culinarias donde familias y
				amigos podran disfrutar de buena comida y buen ambiente
			</p>

			<div className="mt-4 flex flex-col gap-6 sm:flex-row">
				<BasicButton className="h-[3.6rem] w-[16rem] rounded-xl px-8 py-4 text-center font-bold uppercase transition-all duration-300">
					<Link href="#menu">Ver menu</Link>
				</BasicButton>
				<BasicButton className="h-[3.6rem] w-[16rem] rounded-xl border-2 border-white bg-transparent px-8 py-4 text-center font-bold text-white uppercase transition-all duration-300 hover:bg-white hover:text-black">
					<Link href="#order">Ordernar ahora</Link>
				</BasicButton>
			</div>
		</div>
	);
}

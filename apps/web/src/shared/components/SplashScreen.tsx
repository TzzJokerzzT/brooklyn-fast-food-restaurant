"use client";

// ── Splash Screen ──────────────────────────────────────────
// Full-screen loading overlay shown while auth state initializes.
// Uses the Brooklyn brand design: black background, mustard accent.

export function SplashScreen() {
	return (
		<div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
			{/* Logo / Brand */}
			<div className="flex flex-col items-center gap-6">
				{/* Pulsing accent ring */}
				<div className="relative flex items-center justify-center">
					<div className="absolute h-24 w-24 animate-ping rounded-full bg-accent/20" />
					<div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent bg-surface">
						<span className="font-bold text-2xl text-accent">B</span>
					</div>
				</div>

				{/* Brand text */}
				<div className="flex flex-col items-center gap-1">
					<h1 className="font-[family-name:var(--font-texturina)] text-2xl font-bold tracking-wider text-foreground uppercase">
						Brooklyn
					</h1>
					<p className="text-xs tracking-[0.3em] text-muted uppercase">
						Restaurant
					</p>
				</div>

				{/* Loading bar */}
				<div className="mt-4 flex items-center gap-3">
					<div className="h-0.5 w-16 overflow-hidden rounded-full bg-border">
						<div className="h-full w-full origin-left animate-[loading_1.5s_ease-in-out_infinite] bg-accent" />
					</div>
				</div>
			</div>

			{/* Inline keyframes for loading bar */}
			<style>{`
				@keyframes loading {
					0% { transform: scaleX(0); transform-origin: left; }
					50% { transform: scaleX(1); transform-origin: left; }
					50.1% { transform-origin: right; }
					100% { transform: scaleX(0); transform-origin: right; }
				}
			`}</style>
		</div>
	);
}

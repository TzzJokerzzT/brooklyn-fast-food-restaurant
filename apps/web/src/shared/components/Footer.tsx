import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full py-12 border-t-2 border-border bg-black flex flex-col md:flex-row justify-between items-center px-[var(--gutter)] max-w-[var(--container-max)] mx-auto mt-24">
      <div className="text-2xl font-bold text-foreground mb-8 md:mb-0">
        BROOKLYN
        <br />
        FAST FOOD
      </div>
      <div className="flex flex-col items-center md:items-end gap-8">
        <nav className="flex gap-6 flex-wrap justify-center md:justify-end">
          <Link
            className="text-sm text-muted uppercase hover:text-white underline opacity-80 hover:opacity-100 transition-all"
            href="#"
          >
            LOCATIONS
          </Link>
          <Link
            className="text-sm text-muted uppercase hover:text-white underline opacity-80 hover:opacity-100 transition-all"
            href="#"
          >
            NUTRITION
          </Link>
          <Link
            className="text-sm text-muted uppercase hover:text-white underline opacity-80 hover:opacity-100 transition-all"
            href="#"
          >
            CAREERS
          </Link>
          <Link
            className="text-sm text-muted uppercase hover:text-white underline opacity-80 hover:opacity-100 transition-all"
            href="#"
          >
            PRIVACY
          </Link>
        </nav>
        <p className="text-sm text-muted/60 uppercase">
          &copy; 2024 BROOKLYN FAST FOOD. RAW. FAST. AUTHENTIC.
        </p>
      </div>
    </footer>
  );
}

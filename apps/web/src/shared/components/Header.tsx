import { Button } from "@heroui/react";

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-black/70 backdrop-blur-xl border-b border-accent">
      <div className="flex justify-between items-center px-[var(--gutter)] py-4 w-full max-w-[var(--container-max)] mx-auto">
        <div className="font-bold text-xl tracking-tighter text-accent">
          BROOKLYN FAST FOOD
        </div>
        <nav className="hidden md:flex gap-8">
          <a
            className="text-foreground uppercase hover:text-accent transition-colors duration-200"
            href="#promos"
          >
            PROMOS
          </a>
          <a
            className="text-foreground uppercase hover:text-accent transition-colors duration-200"
            href="#menu"
          >
            MENU
          </a>
          <a
            className="text-foreground uppercase hover:text-accent transition-colors duration-200"
            href="#events"
          >
            EVENTS
          </a>
        </nav>
        <div className="flex gap-4 items-center">
          <a
            className="hidden md:block text-foreground hover:text-accent transition-colors duration-200 uppercase"
            href="#signin"
          >
            Registrarse
          </a>
          <Button className="uppercase bg-accent text-accent-foreground">
            Ordenar Ahora
          </Button>
        </div>
      </div>
    </header>
  );
}

# Brooklyn Restaurant — Web App

Frontend de Brooklyn Restaurant. Next.js 16 + HeroUI + Tailwind CSS v4.

## Desarrollo

```bash
# Desde la raíz del monorepo
bun dev

# O directamente en apps/web
cd apps/web
bun dev
```

Disponible en [http://localhost:3000](http://localhost:3000).

## Scripts

| Comando | Descripción |
|---------|-------------|
| `bun dev` | Servidor de desarrollo |
| `bun build` | Build de producción |
| `bun lint` | Linting con Biome |
| `bun typecheck` | Verificación de tipos |
| `bun test` | Tests con Vitest |

## Estructura

```
app/
├── layout.tsx          # Root layout (font, theme)
├── page.tsx            # Landing page
└── globals.css         # Variables, tema HeroUI, Tailwind

src/
├── features/           # Vertical Slice
│   └── landing/        # Landing page
├── shared/             # Componentes compartidos
│   └── components/     # Header, Footer, Layout
└── views/              # Vistas (orchestrators)
```

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
| `bun test` | Tests unitarios con Vitest |
| `bun test:watch` | Tests en modo watch |
| `bun test:coverage` | Tests con reporte de cobertura |

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
│   ├── components/     # Header, Footer, Layout
│   └── store/          # Zustand stores
└── views/              # Vistas (orchestrators)

tests/                  # Vitest tests
├── setup.ts            # Mocks y configuración
├── components/         # Tests de componentes
└── store.test.ts       # Tests de stores
```

## Testing

El proyecto usa **Vitest** con React Testing Library para tests unitarios.

### Configuración

- **Entorno:** jsdom (simula navegador)
- **Globals:** `describe`, `it`, `expect` disponibles sin importar
- **Setup:** `tests/setup.ts` con mocks de localStorage, IntersectionObserver, etc.

### Ejecutar tests

```bash
# Desde apps/web
bun run test          # Ejecuta todos los tests
bun run test:watch    # Modo watch (re-ejecuta al guardar)
bun run test:coverage # Genera reporte de cobertura
```

### Escribir tests

```tsx
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });
});
```

## State Management

El proyecto usa **Zustand** para manejo de estado global.

### Stores disponibles

```typescript
import { useUIStore, useCartStore } from "@/shared/store";

// UI Store
useUIStore.getState().isMenuOpen;
useUIStore.getState().toggleMenu();

// Cart Store
useCartStore.getState().items;
useCartStore.getState().addItem({ id: "1", name: "Burger", price: 12 });
useCartStore.getState().total();
```

### Características

- **Persist:** Los stores se guardan en localStorage automáticamente
- **Devtools:** Integración con Redux DevTools para debugging
- **TypeScript:** Tipado completo en todos los stores

## Paleta de Colores

| Clase Tailwind | Color | Uso |
|----------------|-------|-----|
| `bg-background` | `#000000` | Fondo principal |
| `text-foreground` | `#ffffff` | Texto principal |
| `bg-accent` | `#fd9d08` | Mustard — botones, links |
| `bg-surface` | `#1a1a1a` | Tarjetas, paneles |
| `border-border` | `#333333` | Bordes |
| `text-muted` | `#888888` | Texto secundario |

## Crear Feature

```bash
# Desde la raíz del monorepo
bun feature:create mi-feature

# Crea la estructura:
# src/features/mi-feature/
# ├── components/
# ├── hooks/
# ├── actions/
# ├── services/
# ├── types/
# └── index.ts
```

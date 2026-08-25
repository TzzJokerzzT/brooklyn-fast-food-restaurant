# Brooklyn Restaurant

> RAW. FAST. AUTHENTIC.

Plataforma web para Brooklyn Fast Food — pedidos en línea, menú digital y eventos.

## Arquitectura

```
brooklyn-restaurant/
├── apps/
│   └── web/                    # Next.js 16 (App Router)
│       ├── app/                # Routes y layouts
│       ├── src/
│       │   ├── features/       # Vertical Slice (features)
│       │   │   └── landing/    # Landing page
│       │   │       ├── components/
│       │   │       ├── hooks/
│       │   │       ├── actions/
│       │   │       ├── services/
│       │   │       └── types/
│       │   └── shared/         # Componentes compartidos
│       │       └── components/ # Header, Footer, Layout
│       └── public/             # Assets estáticos
├── packages/                   # Paquetes compartidos
├── scripts/                    # Scripts de utilería
└── turbo.json                  # Configuración de Turborepo
```

**Patrón:** Vertical Slice Architecture — cada feature encapsula sus componentes, hooks, acciones, servicios y tipos de forma independiente.

## Tecnologías

| Categoría | Tecnología | Versión |
|-----------|------------|---------|
| **Runtime** | Bun | 1.4.0 |
| **Framework** | Next.js | 16.3.0 |
| **UI Library** | React | 19.2.0 |
| **Componentes** | HeroUI | 3.2.4 |
| **Estilos** | Tailwind CSS | 4.3.3 |
| **State** | Zustand | 5.0.15 |
| **Validación** | Valibot | 1.4.2 |
| **HTTP** | Axios | 1.19.0 |
| **Testing** | Vitest + Cypress | — |
| **Linting** | Biome | 2.5.10 |
| **Monorepo** | Turborepo | 2.10.11 |
| **Tipado** | TypeScript | 5.9.2 |

## Instalación

### Requisitos

- [Bun](https://bun.sh) >= 1.4.0
- [Node.js](https://nodejs.org) >= 18

### Pasos

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/brooklyn-restaurant.git
cd brooklyn-restaurant

# Instalar dependencias
bun install

# Iniciar desarrollo
bun dev
```

El servidor de desarrollo estará disponible en [http://localhost:3000](http://localhost:3000).

### Comandos disponibles

| Comando | Descripción |
|---------|-------------|
| `bun dev` | Inicia todos los apps en modo desarrollo |
| `bun build` | Construye todos los apps |
| `bun lint` | Verifica código con Biome |
| `bun check-types` | Valida tipos TypeScript |
| `bun feature:create <name>` | Crea una nueva feature Vertical Slice |

### Crear una feature

```bash
# Desde la raíz del proyecto
bun feature:create menu-items

# Esto crea:
# apps/web/src/features/menu-items/
# ├── components/
# ├── hooks/
# ├── actions/
# ├── services/
# ├── types/
# └── index.ts
```

## Estructura de una Feature

```
feature-name/
├── components/    # Componentes React (UI)
├── hooks/         # Custom hooks
├── actions/       # Server Actions ("use server")
├── services/      # Capa de datos / API
├── types/         # Interfaces TypeScript
└── index.ts       # Barrel export
```

## Paleta de Colores

| Token | Valor | Uso |
|-------|-------|-----|
| `--background` | `#000000` | Fondo principal |
| `--foreground` | `#ffffff` | Texto principal |
| `--accent` | `#fd9d08` | Mustard — botones, links, focus |
| `--surface` | `#1a1a1a` | Tarjetas, paneles |
| `--border` | `#333333` | Bordes |
| `--muted` | `#888888` | Texto secundario |

## Tipografía

- **Fuente principal:** Texturina (Google Fonts)
- **Pesos:** 400 (regular), 700 (bold)

## Licencia

Privado — © 2024 Brooklyn Fast Food

# Brooklyn Restaurant

> RAW. FAST. AUTHENTIC.

Plataforma web para Brooklyn Fast Food — pedidos en línea, menú digital y eventos.

## Arquitectura

```
brooklyn-restaurant/
├── apps/
│   ├── web/                        # Next.js 16 (App Router)
│   │   ├── app/                    # Routes y layouts
│   │   ├── src/
│   │   │   ├── features/           # Vertical Slice (features)
│   │   │   │   └── landing/        # Landing page
│   │   │   │       ├── components/
│   │   │   │       ├── hooks/
│   │   │   │       ├── actions/
│   │   │   │       ├── services/
│   │   │   │       └── types/
│   │   │   ├── shared/             # Componentes compartidos
│   │   │   │   ├── components/     # Header, Footer, Layout
│   │   │   │   └── store/          # Zustand stores
│   │   │   └── views/              # View orchestrators
│   │   ├── tests/                  # Vitest tests
│   │   └── public/                 # Assets estáticos
│   └── api/                        # Express + Prisma
│       ├── prisma/                 # Schema y migraciones
│       ├── src/
│       │   ├── routes/             # API endpoints
│       │   ├── lib/                # Prisma client, env config
│       │   └── index.ts            # Server entry point
│       └── .env                    # Variables de entorno
├── packages/                       # Paquetes compartidos
├── scripts/                        # Scripts de utilería
└── turbo.json                      # Configuración de Turborepo
```

**Patrón Frontend:** Vertical Slice Architecture — cada feature encapsula sus componentes, hooks, acciones, servicios y tipos de forma independiente.

**Patrón Backend:** API REST con Express + Prisma ORM + SQLite.

## Tecnologías

### Frontend

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
| **Testing** | Vitest | 4.1.11 |
| **E2E Testing** | Cypress | 15.21.0 |
| **Linting** | Biome | 2.5.10 |
| **Monorepo** | Turborepo | 2.10.11 |
| **Tipado** | TypeScript | 5.9.2 |

### Backend

| Categoría | Tecnología | Versión |
|-----------|------------|---------|
| **Runtime** | Bun | 1.4.0 |
| **Framework** | Express | 5.1.0 |
| **ORM** | Prisma | 6.14.0 |
| **Database** | SQLite | — |
| **Validación** | Zod | 3.25.76 |
| **Seguridad** | Helmet | 8.1.0 |
| **CORS** | cors | 2.8.5 |
| **Logs** | Morgan | 1.10.0 |
| **Tipado** | TypeScript | 5.9.2 |

## Instalación

### Requisitos

- [Bun](https://bun.sh) >= 1.4.0
- [Node.js](https://nodejs.org) >= 18

### Pasos

```bash
# Clonar el repositorio
git clone https://github.com/TzzJokerzzT/brooklyn-fast-food-restaurant.git
cd brooklyn-restaurant

# Instalar dependencias
bun install

# Generar Prisma Client
cd apps/api
bun run db:generate
bun run db:push
cd ../..

# Iniciar desarrollo
bun dev
```

El servidor de desarrollo estará disponible en:
- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend:** [http://localhost:3001](http://localhost:3001)

### Comandos disponibles

#### General

| Comando | Descripción |
|---------|-------------|
| `bun dev` | Inicia todos los apps en modo desarrollo |
| `bun dev:web` | Inicia solo el frontend |
| `bun dev:api` | Inicia solo el backend |
| `bun build` | Construye todos los apps |
| `bun lint` | Verifica código con Biome |
| `bun typecheck` | Valida tipos TypeScript en todos los packages |
| `bun test` | Ejecuta tests con Vitest |
| `bun test:watch` | Ejecuta tests en modo watch |

#### Frontend (apps/web)

| Comando | Descripción |
|---------|-------------|
| `bun run test` | Ejecuta tests unitarios |
| `bun run test:watch` | Tests en modo watch |
| `bun run test:coverage` | Tests con reporte de cobertura |

#### Backend (apps/api)

| Comando | Descripción |
|---------|-------------|
| `bun run dev` | Inicia servidor con hot-reload |
| `bun run build` | Compila TypeScript |
| `bun run db:generate` | Genera Prisma Client |
| `bun run db:push` | Sincroniza schema con la DB |
| `bun run db:migrate` | Crea migración |
| `bun run db:studio` | Abre Prisma Studio (UI) |

#### Features

| Comando | Descripción |
|---------|-------------|
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

## API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/menu` | Obtener menú completo |
| `GET` | `/api/menu/items/:id` | Obtener item del menú |
| `POST` | `/api/orders` | Crear pedido |
| `GET` | `/api/orders/user/:userId` | Pedidos de un usuario |
| `PATCH` | `/api/orders/:id/status` | Actualizar estado del pedido |
| `POST` | `/api/reservations` | Crear reservación |
| `GET` | `/api/reservations/user/:userId` | Reservaciones de un usuario |
| `PATCH` | `/api/reservations/:id/cancel` | Cancelar reservación |
| `GET` | `/api/events` | Obtener eventos activos |
| `GET` | `/api/events/:id` | Obtener evento específico |

## Database Schema

```
User ─┬── Order ──── OrderItem ──── MenuItem
      │
      └── Reservation

Category ──── MenuItem

Event
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

## Git Hooks

El proyecto usa `simple-git-hooks` para automatizar la calidad del código:

| Hook | Qué hace |
|------|----------|
| `pre-commit` | Ejecuta Biome linter en archivos staged |
| `commit-msg` | Valida formato de conventional commits |
| `pre-push` | Verifica TypeScript + build |

### Formato de commits

```
type(scope): descripción

Tipos permitidos: feat, fix, chore, style, refactor, perf, test, docs, ci, build, revert
```

**Ejemplos:**
```bash
feat(auth): add login page
fix(cart): resolve quantity bug
chore: update dependencies
```

## Licencia

Privado — © 2024 Brooklyn Fast Food

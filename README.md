# Brooklyn Restaurant

> RAW. FAST. AUTHENTIC.

Plataforma web para Brooklyn Fast Food — pedidos en línea, menú digital y eventos.

## Arquitectura del Proyecto

Monorepo gestionado con **Turborepo** y **Bun** como package manager.

```
brooklyn-restaurant/
├── apps/
│   ├── web/                          # Next.js 16 (App Router)
│   └── api/                          # Express 5 + Prisma + PostgreSQL
├── packages/
│   ├── ui/                           # @repo/ui — componentes React compartidos
│   ├── eslint-config/                # @repo/eslint-config
│   └── typescript-config/            # @repo/typescript-config
├── scripts/
│   └── create-feature.sh            # Scaffolder de features
├── turbo.json
└── package.json
```

---

## Frontend (`apps/web`)

### Arquitectura: Vertical Slice

Cada feature encapsula sus componentes, hooks, servicios y tipos de forma independiente. No se mezclan entre features.

```
src/
├── app/                              # Next.js App Router (rutas)
│   ├── layout.tsx                    # Root layout (Providers, fuente Texturina, dark theme)
│   ├── page.tsx                      # / → LandingPageView
│   ├── globals.css                   # CSS variables, Tailwind theme, brand tokens
│   └── register/
│       └── page.tsx                  # /register → RegisterPageView
├── src/
│   ├── views/                        # Orchestrators de página (delgados, delegan a features)
│   │   ├── LandingPageView.tsx
│   │   └── RegisterPageView.tsx
│   ├── features/                     # Módulos Vertical Slice
│   │   ├── landing/
│   │   │   ├── components/           # HeroSection, MenuSection, EventsSection
│   │   │   ├── hooks/                # useLanding (useState local)
│   │   │   ├── services/             # fetchLanding (fetch API), mockData
│   │   │   └── types/                # LandingState
│   │   ├── register/
│   │   │   ├── components/           # RegisterForm, RegisterFields
│   │   │   ├── hooks/                # useRegister (useMutation + toast)
│   │   │   └── services/             # register.service.ts (POST /auth/register)
│   │   └── login/                    # Scaffolding (TODO)
│   └── shared/                       # Código compartido entre features
│       ├── components/               # Header, Footer, Layout, Toast, BasicInput, BasicButton
│       ├── hooks/                    # use-auth.ts, use-users.ts
│       ├── services/                 # authService, usersService, types, query-helpers
│       ├── lib/                      # axios.ts (apiClient, interceptors, token refresh)
│       ├── store/                    # Zustand: useUIStore, useCartStore
│       ├── providers/                # Providers (QueryProvider + Toast)
│       ├── utils/                    # validations.ts
│       └── types/                    # BasicInput, BasicButton props
└── tests/
```

### Estructura de una Feature

```
feature-name/
├── components/    # Componentes React (UI específica de la feature)
├── hooks/         # Custom hooks (useQuery/useMutation de TanStack Query)
├── services/      # Llamadas a la API via Axios client compartido
└── index.ts       # Barrel export
```

**Crear una nueva feature:**

```bash
bun feature:create menu-items
# Crea apps/web/src/features/menu-items/ con las carpetas vacías
```

### Tecnologías

| Categoría | Tecnología | Versión | Implementación |
|-----------|------------|---------|----------------|
| **Runtime** | Bun | 1.4.0 | Package manager y runtime |
| **Framework** | Next.js | 16.3.0 | App Router, Server Components, Server Actions |
| **UI Library** | React | 19.2.0 | Componentes funcionales + hooks |
| **Componentes** | HeroUI | 3.2.4 | TextField, Button — envueltos en BasicInput/BasicButton |
| **Estilos** | Tailwind CSS | 4.3.3 | Utility-first + CSS variables para brand tokens |
| **Animación** | Motion | 13.2.0 | LazyMotion, staggered animations en formularios |
| **HTTP Client** | Axios | 1.19.0 | apiClient con interceptors, token refresh automático en 401 |
| **Server State** | TanStack React Query | 5.102.8 | useQuery/useMutation, query key factories, cache management |
| **Client State** | Zustand | 5.0.15 | useUIStore (menu, dark mode), useCartStore (carrito) — persistidos a localStorage |
| **Validación** | Valibot | 1.4.2 | Validación de formularios |
| **Testing** | Vitest + Testing Library | 4.1.11 | Unit tests con jsdom |
| **E2E Testing** | Cypress | 15.21.0 | Tests end-to-end |
| **Linting** | Biome | 2.5.10 | Linting + formatting (tabs, double quotes, semicolons) |
| **Monorepo** | Turborepo | 2.10.11 | Build caching, parallel execution |
| **Tipado** | TypeScript | 5.9.2 | Strict mode |

### Componentes Compartidos (`shared/components/`)

| Componente | Archivo | Propósito |
|------------|---------|-----------|
| `Layout` | `layout.tsx` | Wrapper: Header + main + Footer |
| `Header` | `Header.tsx` | Navbar fijo, logo, links de navegación, CTA "Ordenar Ahora" |
| `Footer` | `Footer.tsx` | Footer con links de navegación |
| `Toast` / `showToast` | `Toast.tsx` | Sistema global de notificaciones (ToastQueue + CustomToast) |
| `BasicInput` | `BasicInput.tsx` | Wrapper de HeroUI TextField con validación |
| `BasicButton` | `ui/BasicButton.tsx` | Botón HeroUI con estados pending/spinner |
| `FormEnterAnimation` | `animation/FormEnterAnimation.tsx` | Animación staggered de entrada para formularios |
| `LazyMotionComponent` | `animation/LazyMotionComponent.tsx` | Provider de LazyMotion con domAnimation |

### Hooks

| Hook | Archivo | Descripción |
|------|---------|-------------|
| `useMe` | `shared/hooks/use-auth.ts` | Obtiene usuario actual (GET /auth/me) |
| `useLogin` | `shared/hooks/use-auth.ts` | Mutación POST /auth/login |
| `useRegister` | `shared/hooks/use-auth.ts` | Mutación POST /auth/register (versión compartida) |
| `useLogout` | `shared/hooks/use-auth.ts` | Limpia tokens + cache + redirect |
| `useUsers` | `shared/hooks/use-users.ts` | Lista paginada de usuarios |
| `useUser` | `shared/hooks/use-users.ts` | Detalle de usuario individual |
| `useCreateUser` | `shared/hooks/use-users.ts` | Crear usuario |
| `useUpdateUser` | `shared/hooks/use-users.ts` | Actualizar usuario |
| `useUpdateUserRole` | `shared/hooks/use-users.ts` | PATCH /users/:id/role |
| `useUpdateUserStatus` | `shared/hooks/use-users.ts` | PATCH /users/:id/status |
| `useDeleteUser` | `shared/hooks/use-users.ts` | Eliminar usuario |
| `useRegister` (feature) | `features/register/hooks/index.ts` | Register con toast + redirect |

### Servicios

| Servicio | Archivo | Endpoints |
|----------|---------|-----------|
| `authService` | `shared/services/auth.service.ts` | login, refresh, me, logout |
| `usersService` | `shared/services/users.service.ts` | create, getAll, getById, update, updateRole, updateStatus, delete |
| `registerService` | `features/register/services/register.service.ts` | register (POST /auth/register) |

### Utils

| Util | Archivo | Funciones |
|------|---------|-----------|
| `validations` | `shared/utils/validations.ts` | `validateEmail`, `validatePassword`, `validatePasswordConfirm`, `validateName` |
| `axios` | `shared/lib/axios.ts` | `apiClient` (interceptors, refresh queue), `tokenStorage`, `getErrorMessage` |
| `query-helpers` | `shared/services/query-helpers.ts` | `handleApiResponse`, `ApiQueryError` |

### State Management

**Server State (TanStack React Query):**
- `staleTime: 60s`, `gcTime: 5min`, `retry: 1`
- Global `onError` en mutaciones → toast notifications
- Query key factories por dominio: `authKeys`, `usersKeys`
- Optimistic updates via `setQueryData` en mutation success

**Client State (Zustand):**
- `useUIStore` — `isMenuOpen`, `isDarkMode` (persistido a localStorage)
- `useCartStore` — `items[]`, `addItem`, `removeItem`, `updateQuantity`, `clearCart`, `total()` (persistido a localStorage)
- Ambos con `devtools` middleware para debugging

### Routing

| Ruta | Archivo | Vista |
|------|---------|-------|
| `/` | `app/page.tsx` | `LandingPageView` → Hero + Menu + Events + Register |
| `/register` | `app/register/page.tsx` | `RegisterPageView` → Formulario de registro |

---

## Backend (`apps/api`)

### Arquitectura: Clean Architecture (3 Capas)

```
domain/              → Entidades, Interfaces (sin dependencias externas)
    ↑
infrastructure/      → Repositorios Prisma, Services (implementaciones concretas)
    ↑
presentation/        → Controllers, Routes (handlers Express)
```

**Flujo de dependencias:** Domain ← Infrastructure ← Presentation

```
src/
├── index.ts                        # Entry point del servidor Express
├── domain/                         # Capa de dominio
│   ├── entities/
│   │   ├── user.entity.ts          # User, Role, DTOs, TokenPayload, toUserResponse()
│   │   └── role.entity.ts          # Role, DEFAULT_ROLES, ROLE_NAMES
│   └── interfaces/
│       ├── auth-service.interface.ts
│       ├── jwt-service.interface.ts
│       ├── password-service.interface.ts
│       ├── user-repository.interface.ts
│       └── role-repository.interface.ts
├── infrastructure/                 # Capa de infraestructura
│   ├── repositories/
│   │   ├── user.repository.ts      # Implementación Prisma de IUserRepository
│   │   └── role.repository.ts      # Implementación Prisma de IRoleRepository
│   └── services/
│       ├── auth.service.ts         # AuthService (login, register, refresh)
│       ├── jwt.service.ts          # JWTService (generate/verify tokens)
│       └── password.service.ts     # PasswordService (hash/compare bcrypt)
├── presentation/                   # Capa de presentación
│   ├── controllers/
│   │   ├── auth.controller.ts      # AuthController (register, login, refresh, me)
│   │   └── users.controller.ts     # UsersController (CRUD + role/status)
│   └── routes/
│       ├── auth.routes.ts          # Router de autenticación
│       └── users.routes.ts         # Router de usuarios (protegido)
├── middleware/
│   ├── auth.middleware.ts          # authenticate, authorize, requireAdmin, requireSuperAdmin
│   └── validation.middleware.ts    # validateRegister, validateLogin, validateUpdateUser (Zod)
└── lib/
    ├── prisma.ts                   # Singleton de Prisma (global caching)
    └── env.ts                      # Variables de entorno validadas con Zod
```

### Tecnologías

| Categoría | Tecnología | Versión | Implementación |
|-----------|------------|---------|----------------|
| **Runtime** | Node.js | — | tsx watch para desarrollo |
| **Framework** | Express | 5.2.1 | HTTP server, routing, middleware |
| **ORM** | Prisma | 6.14.0 | Schema-first, migraciones, Client |
| **Database** | PostgreSQL | — | Supabase (pooler + direct URL) |
| **Auth** | jsonwebtoken | 9.0.3 | JWT access + refresh tokens |
| **Password** | bcrypt | 6.0.0 | Hash (12 rounds) + compare |
| **Validación** | Zod | 3.25.76 | Request validation + env vars |
| **Seguridad** | Helmet | 8.3.0 | Security headers |
| **CORS** | cors | 2.8.5 | Cross-origin con credentials |
| **Rate Limiting** | express-rate-limit | — | 20 req/public, 1000 req/auth |
| **Logs** | Morgan | 1.10.0 | HTTP request logging (dev) |
| **Testing** | Vitest | 4.1.11 | Unit tests |
| **Tipado** | TypeScript | 5.9.2 | Strict mode |

### Database Schema

```prisma
Role (1) ←── (N) User (1) ←── (N) Purchase (N) ──→ (1) Product
Event (independiente)
```

| Modelo | Tabla | Campos clave |
|--------|-------|--------------|
| `Role` | `roles` | id, name (unique) |
| `User` | `users` | id, userName, lastName, email (unique, indexed), password, address, phoneNumber, isActive, lastLoginAt, roleId (indexed) |
| `Product` | `products` | id, productName, productImage, isPromotion, price, ingredients |
| `Purchase` | `purchases` | id, quantity, purchaseDate, userId, productId |
| `Event` | `events` | id, eventName, description, eventImage, eventDateFrom, eventDateTo |

**Roles por defecto (seeded):** super-admin (1), admin (2), clients (3)

### Cómo Crear un Nuevo Servicio

**1. Definir la interfaz en `domain/interfaces/`:**

```typescript
// domain/interfaces/product-service.interface.ts
import type { Product, CreateProductDTO } from "../entities/product.entity.js";

export interface IProductService {
  findAll(): Promise<Product[]>;
  findById(id: number): Promise<Product | null>;
  create(data: CreateProductDTO): Promise<Product>;
}
```

**2. Crear la entidad en `domain/entities/`:**

```typescript
// domain/entities/product.entity.ts
export interface Product {
  id: number;
  productName: string;
  price: number;
}

export interface CreateProductDTO {
  productName: string;
  price: number;
}
```

**3. Implementar en `infrastructure/services/`:**

```typescript
// infrastructure/services/product.service.ts
import type { IProductService } from "@/domain/interfaces/product-service.interface.js";

export class ProductService implements IProductService {
  constructor(private readonly productRepository: IProductRepository) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.findAll();
  }
  // ...
}
```

**4. Crear el repository en `infrastructure/repositories/`:**

```typescript
// infrastructure/repositories/product.repository.ts
import { prisma } from "@/lib/prisma.js";

export class ProductRepository implements IProductRepository {
  async findAll() {
    return prisma.product.findMany();
  }
  // ...
}
```

**5. Crear controller en `presentation/controllers/`:**

```typescript
// presentation/controllers/products.controller.ts
export class ProductsController {
  constructor(private readonly productService: IProductService) {}

  async getAll(req: Request, res: Response): Promise<void> {
    const products = await this.productService.findAll();
    res.json({ success: true, data: products });
  }
}
```

**6. Crear routes en `presentation/routes/`:**

```typescript
// presentation/routes/products.routes.ts
import { Router } from "express";
import { ProductsController } from "../controllers/products.controller.js";

const router = Router();
// Wiring manual de dependencias
const controller = new ProductsController(productService);

router.get("/", (req, res) => controller.getAll(req, res));

export default router;
```

**7. Montar en `src/index.ts`:**

```typescript
import productsRouter from "./presentation/routes/products.routes.js";

app.use("/api/v1/products", productsRouter);
```

### Endpoints Implementados

Base: `/api/v1` (también disponible en `/api`)

| Método | Ruta | Auth | Rol | Validación | Handler |
|--------|------|------|-----|------------|---------|
| `GET` | `/health` | No | — | — | Health check (status, timestamp, uptime) |
| `POST` | `/auth/register` | No | — | `validateRegister` (Zod) | `AuthController.register` |
| `POST` | `/auth/login` | No | — | `validateLogin` (Zod) | `AuthController.login` |
| `POST` | `/auth/refresh` | No | — | — | `AuthController.refresh` |
| `GET` | `/auth/me` | Bearer JWT | Cualquier rol | — | `AuthController.me` |
| `GET` | `/users` | Bearer JWT | admin (1,2) | — | `UsersController.getAll` (paginado, buscable) |
| `GET` | `/users/:id` | Bearer JWT | admin (1,2) | — | `UsersController.getById` |
| `POST` | `/users` | Bearer JWT | super-admin (1) | — | `UsersController.create` |
| `PUT` | `/users/:id` | Bearer JWT | admin (1,2) | `validateUpdateUser` (Zod) | `UsersController.update` |
| `PATCH` | `/users/:id/role` | Bearer JWT | super-admin (1) | — | `UsersController.updateRole` |
| `PATCH` | `/users/:id/status` | Bearer JWT | admin (1,2) | — | `UsersController.updateStatus` |
| `DELETE` | `/users/:id` | Bearer JWT | super-admin (1) | — | `UsersController.delete` |

### Swagger API Docs

El backend incluye **Swagger UI** para documentación interactiva de la API.

**URL de acceso:**

```
http://localhost:3001/api/docs
```

**Cómo usarlo:**

1. Iniciar el backend:
   ```bash
   cd apps/api
   bun run dev
   ```

2. Abrir `http://localhost:3001/api/docs` en el navegador

3. Verás la documentación de todos los endpoints organizados por tags:
   - **Health** — Health check
   - **Auth** — Register, login, refresh, me
   - **Users** — CRUD de usuarios (admin/super-admin)

**Autenticación en Swagger:**

Para probar endpoints protegidos (como `/users` o `/auth/me`):

1. Ejecuta `POST /auth/login` con credenciales válidas
2. Copia el `accessToken` de la respuesta
3. Haz clic en el botón **Authorize** (arriba a la derecha)
4. Pega el token en el campo: `Bearer <tu-access-token>`
5. Ahora puedes ejecutar endpoints protegidos sin recibir 401

**Archivos:**

| Archivo | Descripción |
|---------|-------------|
| `apps/api/swagger.yaml` | Definición OpenAPI 3.0.3 completa |
| `apps/api/src/index.ts` | Setup de swagger-ui-express (ruta `/api/docs`) |

**Endpoints documentados:**

- `GET /health` — Health check (sin auth)
- `POST /auth/register` — Registro de usuario (sin auth)
- `POST /auth/login` — Login y obtención de tokens (sin auth)
- `POST /auth/refresh` — Refresh de access token (sin auth)
- `GET /auth/me` — Usuario actual (requiere JWT)
- `GET /users` — Lista paginada de usuarios (admin/super-admin)
- `GET /users/:id` — Detalle de usuario (admin/super-admin)
- `POST /users` — Crear usuario (super-admin)
- `PUT /users/:id` — Actualizar usuario (admin/super-admin)
- `PATCH /users/:id/role` — Cambiar rol (super-admin)
- `PATCH /users/:id/status` — Activar/desactivar (admin/super-admin)
- `DELETE /users/:id` — Eliminar usuario (super-admin)

**Shape de respuesta (consistente):**

```json
{
  "success": true,
  "data": { ... },
  "message": "Operación exitosa"
}
```

### Middleware

**Globales (en `src/index.ts`):**
1. `helmet()` — Security headers
2. `cors()` — CORS con credentials
3. `morgan('dev')` — Logging HTTP
4. `express.json()` — Body parsing JSON
5. `express.urlencoded()` — Body parsing URL-encoded

**Per-ruta:**

| Middleware | Rutas aplicadas |
|-----------|-----------------|
| `authenticate` | `GET /auth/me`, todos `/users` |
| `requireAdmin` (roles 1,2) | `GET/PUT /users`, `PATCH /users/:id/status` |
| `requireSuperAdmin` (rol 1) | `POST /users`, `PATCH /users/:id/role`, `DELETE /users/:id` |
| `validateRegister` | `POST /auth/register` |
| `validateLogin` | `POST /auth/login` |
| `validateUpdateUser` | `PUT /users/:id` |

---

## Instalación

### Requisitos

- [Bun](https://bun.sh) >= 1.4.0
- [Node.js](https://nodejs.org) >= 18
- [PostgreSQL](https://postgresql.org) (o Supabase)

### Pasos

```bash
# Clonar el repositorio
git clone https://github.com/TzzJokerzzT/brooklyn-fast-food-restaurant.git
cd brooklyn-restaurant

# Instalar dependencias
bun install

# Configurar variables de entorno
cp apps/api/.env.example apps/api/.env
# Editar apps/api/.env con tus credenciales de base de datos

# Generar Prisma Client
cd apps/api
bun run db:generate

# Crear migración y sincronizar
bun run db:migrate
cd ../..

# Iniciar desarrollo
bun dev
```

**URLs de desarrollo:**
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:3001](http://localhost:3001)

### Comandos

#### General

| Comando | Descripción |
|---------|-------------|
| `bun dev` | Inicia todos los apps en modo desarrollo |
| `bun dev:web` | Inicia solo el frontend |
| `bun dev:api` | Inicia solo el backend |
| `bun build` | Construye todos los apps |
| `bun lint` | Verifica código con Biome |
| `bun typecheck` | Valida tipos TypeScript |
| `bun test` | Ejecuta tests con Vitest |

#### Frontend (`apps/web`)

| Comando | Descripción |
|---------|-------------|
| `bun run test` | Tests unitarios |
| `bun run test:watch` | Tests en modo watch |
| `bun run test:coverage` | Tests con reporte de cobertura |

#### Backend (`apps/api`)

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

---

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

```bash
feat(auth): add login page
fix(cart): resolve quantity bug
chore: update dependencies
```

## Licencia

Privado — © 2024 Brooklyn Fast Food

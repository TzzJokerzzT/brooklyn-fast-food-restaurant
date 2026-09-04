# Brooklyn Fast Food Restaurant — Engram Memory Export

> Exportado el: 2026-09-03
> Proyecto: brooklyn-fast-food-restaurant

---

## Resumen del Proyecto

Plataforma web para Brooklyn Fast Food — pedidos en línea, menú digital y eventos.

### Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | Next.js 16 (App Router), React 19, HeroUI, Tailwind CSS, TanStack Query, Zustand |
| Backend | Express 5, Prisma, PostgreSQL, Clean Architecture |
| Monorepo | Turborepo, Bun |
| Imágenes | Cloudinary |

---

## Decisiones Arquitectónicas

### Frontend: Vertical Slice Architecture

Cada feature encapsula sus componentes, hooks, servicios y tipos de forma independiente.

**Estructura de una feature:**
```
feature-name/
├── components/    # Componentes React (UI específica de la feature)
├── hooks/         # Custom hooks (useQuery/useMutation)
├── services/      # Llamadas a la API via Axios
└── index.ts       # Barrel export
```

**Crear nueva feature:**
```bash
bun feature:create menu-items
```

### Backend: Clean Architecture (3 Capas)

```
domain/              → Entidades, Interfaces (sin dependencias externas)
    ↑
infrastructure/      → Repositorios Prisma, Services (implementaciones concretas)
    ↑
presentation/        → Controllers, Routes (handlers Express)
```

**Cómo crear un nuevo servicio:**
1. Definir interfaz en `domain/interfaces/`
2. Crear entidad en `domain/entities/`
3. Implementar en `infrastructure/services/`
4. Crear repository en `infrastructure/repositories/`
5. Crear controller en `presentation/controllers/`
6. Crear routes en `presentation/routes/`
7. Montar en `src/index.ts`

---

## Endpoints Implementados

### Autenticación

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `POST` | `/auth/register` | No | Registro (devuelve user, sin tokens) |
| `POST` | `/auth/login` | No | Login (devuelve user + tokens) |
| `POST` | `/auth/refresh` | No | Refresh de tokens |
| `GET` | `/auth/me` | JWT | Usuario actual |

### Usuarios

| Método | Ruta | Auth | Rol | Descripción |
|--------|------|------|-----|-------------|
| `GET` | `/users` | JWT | admin | Lista paginada |
| `GET` | `/users/:id` | JWT | admin | Detalle de usuario |
| `POST` | `/users` | JWT | super-admin | Crear usuario |
| `PUT` | `/users/:id` | JWT | admin | Actualizar usuario |
| `PATCH` | `/users/:id/role` | JWT | super-admin | Cambiar rol |
| `PATCH` | `/users/:id/status` | JWT | admin | Activar/desactivar |
| `DELETE` | `/users/:id` | JWT | super-admin | Eliminar usuario |

### Productos

| Método | Ruta | Auth | Rol | Descripción |
|--------|------|------|-----|-------------|
| `GET` | `/products` | No | — | Lista paginada |
| `GET` | `/products/:id` | No | — | Detalle de producto |
| `POST` | `/products` | JWT | admin | Crear producto (multipart) |
| `POST` | `/products/bulk` | JWT | admin | Crear múltiples productos |
| `PUT` | `/products/:id` | JWT | admin | Actualizar producto (multipart) |
| `DELETE` | `/products/:id` | JWT | admin | Eliminar producto |
| `DELETE` | `/products/bulk` | JWT | admin | Eliminar múltiples productos |

### Health Check

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/health` | Health check |

---

## Database Schema

```prisma
Role (1) ←── (N) User (1) ←── (N) Purchase (N) ──→ (1) Product
Event (independiente)
```

### Modelos

| Modelo | Tabla | Campos clave |
|--------|-------|--------------|
| `Role` | `roles` | id, name (unique) |
| `User` | `users` | id, userName, lastName, email, password, address, phoneNumber, isActive, lastLoginAt, roleId |
| `Product` | `products` | id, productName, productImage, isPromotion, price, ingredients (String[]), createdAt, updatedAt |
| `Purchase` | `purchases` | id, quantity, purchaseDate, userId, productId |
| `Event` | `events` | id, eventName, description, eventImage, eventDateFrom, eventDateTo |

### Roles por defecto

| Rol | ID | Descripción |
|-----|----|-------------|
| super-admin | 1 | Acceso total al sistema |
| admin | 2 | Gestión de usuarios (lectura/actualización) |
| clients | 3 | Clientes regulares (default en registro) |

---

## Variables de Entorno

```bash
# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# Server
PORT=3001
NODE_ENV=development

# JWT
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

---

## APIs Principales

### Axios Client (`shared/lib/axios.ts`)
- Interceptors para manejo de errores
- Token refresh automático en 401
- Cola de requests para evitar race conditions

### React Query
- `staleTime: 60s`, `gcTime: 5min`, `retry: 1`
- Global `onError` en mutaciones → toast notifications
- Query key factories por dominio

### Zustand Stores
- `useUIStore` — isMenuOpen, isDarkMode (persistido a localStorage)
- `useCartStore` — items[], addItem, removeItem, updateQuantity, clearCart, total()

---

## Componentes Compartidos

| Componente | Propósito |
|------------|-----------|
| `Layout` | Header + main + Footer |
| `Header` | Navbar fijo, logo, links, CTA |
| `Footer` | Footer con links |
| `Toast` / `showToast` | Sistema global de notificaciones |
| `BasicInput` | Wrapper de HeroUI TextField |
| `BasicButton` | Botón con estados pending/spinner |
| `FormEnterAnimation` | Animación staggered de entrada |
| `LazyMotionComponent` | Provider de LazyMotion |

---

## Hooks Principales

| Hook | Descripción |
|------|-------------|
| `useMe` | Obtiene usuario actual |
| `useLogin` | Mutación de login |
| `useRegister` | Mutación de registro |
| `useLogout` | Limpia tokens + cache + redirect |
| `useUsers` | Lista paginada de usuarios |
| `useCreateUser` | Crear usuario |
| `useUpdateUser` | Actualizar usuario |
| `useDeleteUser` | Eliminar usuario |

---

## Documentación API

Swagger UI disponible en: `http://localhost:3001/api/docs`

Definición OpenAPI 3.0.3 en: `apps/api/swagger.yaml`

---

## Git Hooks

| Hook | Qué hace |
|------|----------|
| `pre-commit` | Ejecuta Biome linter |
| `commit-msg` | Valida conventional commits |
| `pre-push` | Verifica TypeScript + build |

### Formato de commits
```
type(scope): descripción

Tipos: feat, fix, chore, style, refactor, perf, test, docs, ci, build, revert
```

---

## Commits Recientes

```
37a2ff8 fix(products): resolve TypeScript errors for multer types
560bd20 chore: add multer dependencies
ededf6f feat(products): add Product CRUD with Cloudinary image upload
36a9f48 chore: delete useRegister from barrel imports
a3c7c3b chore: delete useRegister, delete unused imports
0ba5659 chore: add swagger dependencies
2f0defe chore: add swagger
f132a71 feat(web): update register feature with phoneNumber support
1e24c82 feat(auth): add phoneNumber to register and remove token response
0ecaed2 chore: update skill registry
8373960 feat(web): add UI components and improve register feature
5dca374 refactor(web): simplify register feature using shared HTTP layer
53aa0b7 feat(web): improve HTTP layer with error normalization and toast
```

---

## Notas para el Equipo

### Configuración inicial
1. `bun install`
2. Configurar `.env` con credenciales de PostgreSQL y Cloudinary
3. `cd apps/api && bunx prisma migrate dev`
4. `bun dev`

### Swagger Docs
- Acceder a `http://localhost:3001/api/docs`
- Login → copiar accessToken → click Authorize → pegar token

### Cloudinary
- Las imágenes se suben automáticamente al crear/editar productos
- Las imágenes se eliminan automáticamente al eliminar productos
- Límite: 5MB por imagen

### Productos
- GET es público (no requiere auth)
- Mutaciones requieren rol admin o super-admin
- Soporte para creación/eliminación masiva (bulk)

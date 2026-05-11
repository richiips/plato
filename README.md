# Plato — carta digital para restaurantes

SaaS de menús digitales con QR. Panel de administración para super-admins, dashboard para dueños, y carta pública en `/r/[slug]`.

---

## Requisitos

- Node 20+
- pnpm 10+
- Una cuenta de Supabase (proyecto con las migraciones aplicadas)
- Una cuenta de Cloudflare Images *(solo para subir imágenes)*

---

## Setup local

### 1. Clonar e instalar dependencias

```bash
git clone <repo>
cd plato
pnpm install
```

### 2. Variables de entorno

Copia el ejemplo y rellena los valores:

```bash
cp .env.local.example .env.local
```

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (solo servidor) |
| `CLOUDFLARE_ACCOUNT_ID` | ID de cuenta Cloudflare |
| `CLOUDFLARE_IMAGES_API_TOKEN` | API token con permiso *Images: Edit* |
| `CLOUDFLARE_IMAGES_HASH` | Hash del delivery URL (`imagedelivery.net/<hash>/…`) |
| `NEXT_PUBLIC_APP_URL` | URL pública de la app (para QRs) |
| `REVALIDATE_SECRET` | Secret para el webhook `/api/revalidate` |

### 3. Base de datos

El esquema completo (tablas, índices, RLS, funciones RPC, trigger de signup) está en `supabase/migrations/20260511000000_initial_schema.sql`.

**Opción A — Supabase Cloud (recomendado para empezar)**

Abre el SQL Editor de tu proyecto en [supabase.com](https://supabase.com), pega el contenido del archivo de migración y ejecútalo.

**Opción B — Supabase CLI**

```bash
# Instalar la CLI si no la tienes
brew install supabase/tap/supabase

# Vincular con tu proyecto remoto
supabase login
supabase link --project-ref <tu-project-ref>

# Aplicar migraciones pendientes
supabase db push
```

**Primer super_admin**

Crea un usuario en Supabase Auth (panel → Authentication → Users → "Invite user"), luego actualiza su rol manualmente en el SQL Editor:

```sql
update public.profiles set role = 'super_admin' where email = 'tu@email.com';
```

### 4. Poblar restaurante demo

El demo en vivo de la landing usa el slug `demo`. Créalo con:

```bash
pnpm seed
```

### 5. Servidor de desarrollo

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `pnpm dev` | Servidor de desarrollo Next.js |
| `pnpm build` | Build de producción |
| `pnpm start` | Servidor de producción |
| `pnpm lint` | ESLint |
| `pnpm format` | Prettier (escribe cambios) |
| `pnpm seed` | Popula el restaurante demo |

---

## Estructura del proyecto

```
app/
  (public)/         # Landing page y cartas públicas /r/[slug]
  admin/            # Panel super-admin
  dashboard/        # Panel para dueños/managers
  api/
    qr/[slug]/      # GET → devuelve QR en PNG
    track/          # POST → registra evento de analytics
    cloudflare/     # POST → genera URL de subida directa
components/
  admin/            # Componentes del panel admin
  dashboard/        # Componentes del dashboard
  landing/          # Componentes de la landing
  ui/               # shadcn/ui
lib/
  actions/          # Server Actions de Next.js
  supabase/         # Clientes Supabase (server, client, admin)
  auth.ts           # requireAuth, requireSuperAdmin, requireRestaurantAccess
scripts/
  seed.ts           # Script de seed del restaurante demo
types/
  database.ts       # Tipos de Supabase
  menu.ts           # Helpers de menú (getLocalizedText, etc.)
```

---

## API pública

### `GET /api/qr/[slug]`

Devuelve un PNG de 512×512 px con el QR que apunta a `/r/[slug]`.

```
/api/qr/demo → descarga qr-demo.png
```

### `POST /api/track`

Registra un evento de analytics. No requiere autenticación.

```json
{
  "restaurant_id": "uuid",
  "event_type": "item_view",
  "event_data": { "item_id": "uuid" },
  "session_id": "opcional"
}
```

---

## Roles

| Rol | Acceso |
|---|---|
| `super_admin` | Todos los restaurantes vía `/admin` |
| `owner` | Su restaurante vía `/dashboard`, puede editar todo |
| `manager` | Su restaurante vía `/dashboard`, puede editar menú y settings |
| `staff` | Solo lectura |

---

## Deploy

El proyecto está pensado para Vercel. Añade las variables de entorno en el panel de Vercel y conecta el repositorio. Las migraciones de Supabase se aplican manualmente.

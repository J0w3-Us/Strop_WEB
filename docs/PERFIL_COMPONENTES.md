# Documentación de Componentes de Perfil

## 📋 Índice

1. [Página de Perfil](#página-de-perfil)
2. [Store de Autenticación](#store-de-autenticación)
3. [Servicio de Datos](#servicio-de-datos)
4. [Tipos de Datos](#tipos-de-datos)
5. [Esquema de Base de Datos](#esquema-de-base-de-datos)

---

## 📄 Página de Perfil

**Archivo:** `src/pages/perfil.astro`

### Descripción

Página para visualizar y editar el perfil del usuario autenticado.

### Estructura Visual

```
┌─────────────────────────────────────────────────┐
│              PERFIL DE USUARIO                  │
├─────────────────────────────────────────────────┤
│  ┌──────┐                                       │
│  │  JD  │  Juan Díaz                           │
│  └──────┘  juan@empresa.com                    │
│            [Administrador]                      │
├─────────────────────────────────────────────────┤
│  INFORMACIÓN PERSONAL                           │
│  ───────────────────                           │
│  Nombre Completo:  [Juan Díaz_________]        │
│  Email:            juan@empresa.com (disabled)  │
│  Rol:              Administrador (disabled)     │
│  Miembro desde:    15 de enero de 2024         │
│                                                 │
│  [Guardar Cambios]                              │
├─────────────────────────────────────────────────┤
│  SEGURIDAD                                      │
│  ─────────                                      │
│  Para cambiar tu contraseña, cierra sesión...  │
│  [Cambiar Contraseña]                           │
└─────────────────────────────────────────────────┘
```

### Props y Datos

| Dato      | Fuente         | Descripción                                    |
| --------- | -------------- | ---------------------------------------------- |
| `user`    | `Astro.locals` | Usuario autenticado (inyectado por middleware) |
| `error`   | local          | Mensaje de error del formulario                |
| `success` | local          | Flag de éxito en la actualización              |

### Campos del Formulario

| Campo        | Editable | Validación          |
| ------------ | -------- | ------------------- |
| `full_name`  | ✅ Sí    | Requerido, no vacío |
| `email`      | ❌ No    | Solo lectura        |
| `role`       | ❌ No    | Solo lectura        |
| `created_at` | ❌ No    | Solo lectura        |

### Funciones Helper

```typescript
// Traduce el rol del sistema a texto legible
function getRoleDisplay(role: string): string {
  const roles: Record<string, string> = {
    owner_admin: "Administrador",
    superintendent: "Superintendente",
    resident: "Residente",
    cabo: "Cabo",
  };
  return roles[role] || role;
}

// Formatea la fecha de creación
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
```

### Flujo de Actualización

```
┌─────────────────┐
│ Usuario edita   │
│ nombre y envía  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ POST /perfil    │
│ FormData        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ❌     ┌─────────────────┐
│ ¿Nombre válido? │───────────►│ Mostrar error   │
└────────┬────────┘            └─────────────────┘
         │ ✅
         ▼
┌─────────────────┐
│ dataService.    │
│ updateProfile() │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐ ┌───────┐
│Success│ │ Error │
└───┬───┘ └───┬───┘
    │         │
    ▼         ▼
┌───────────────────┐
│ Mostrar mensaje   │
└───────────────────┘
```

### Estilos CSS Clave

| Clase                 | Descripción                       |
| --------------------- | --------------------------------- |
| `.profile-page`       | Contenedor principal con padding  |
| `.profile-container`  | Card contenedor max-width 600px   |
| `.profile-header`     | Sección con avatar e info básica  |
| `.avatar-placeholder` | Avatar con inicial si no hay foto |
| `.role-badge`         | Badge con el rol del usuario      |
| `.message.error`      | Alerta de error en rojo           |
| `.message.success`    | Alerta de éxito en verde          |
| `.input.disabled`     | Campos de solo lectura            |

---

## 🗄️ Store de Autenticación

**Archivo:** `src/stores/auth.ts`

### Descripción

Store de Nanostores que maneja el estado global de autenticación y perfil del usuario.

### Estados (Atoms)

```typescript
// Perfil del usuario autenticado
export const $userProfile = atom<Profile | null>(null);

// Estado de carga de autenticación
export const $authLoading = atom<boolean>(true);
```

### Valores Computados

```typescript
// ¿Está autenticado?
export const $isAuthenticated = computed(
  $userProfile,
  (profile) => profile !== null
);

// ¿Es administrador?
export const $isAdmin = computed(
  $userProfile,
  (profile) => profile?.role === "owner_admin"
);

// ¿Es manager (admin o superintendent)?
export const $isManager = computed(
  $userProfile,
  (profile) =>
    profile?.role === "owner_admin" || profile?.role === "superintendent"
);
```

### Acciones

```typescript
// Establecer el perfil del usuario
setUserProfile(profile: Profile | null): void

// Limpiar autenticación (logout)
clearAuth(): void
```

### Uso en Componentes React

```tsx
import { useStore } from "@nanostores/react";
import { $userProfile, $isAdmin } from "../stores/auth";

function ProfileBadge() {
  const profile = useStore($userProfile);
  const isAdmin = useStore($isAdmin);

  return (
    <div>
      <span>{profile?.full_name}</span>
      {isAdmin && <span>👑</span>}
    </div>
  );
}
```

---

## 🔌 Servicio de Datos

**Archivo:** `src/lib/dataService.ts`

### Función: `updateProfile`

```typescript
export async function updateProfile(
  userId: string,
  updates: { full_name?: string }
): Promise<{ data: Profile | null; error: any }>;
```

### Parámetros

| Parámetro           | Tipo      | Descripción                   |
| ------------------- | --------- | ----------------------------- |
| `userId`            | `string`  | UUID del usuario a actualizar |
| `updates`           | `object`  | Campos a actualizar           |
| `updates.full_name` | `string?` | Nuevo nombre completo         |

### Comportamiento

#### Modo Mock (Desarrollo)

```typescript
if (USE_MOCK_DATA) {
  if (mockData.user.id === userId) {
    Object.assign(mockData.user.profile, updates);
  }
  return { data: mockData.user.profile, error: null };
}
```

#### Modo Producción (Supabase)

```typescript
const { data, error } = await supabase
  .from("profiles")
  .update({ ...updates, updated_at: new Date().toISOString() })
  .eq("id", userId)
  .select()
  .single();
```

### Retorno

```typescript
// Éxito
{ data: Profile, error: null }

// Error
{ data: null, error: { message: string } }
```

---

## 📝 Tipos de Datos

**Archivo:** `src/lib/supabase.ts`

### Interface: `Profile`

```typescript
export interface Profile {
  id: string; // UUID (FK a auth.users)
  organization_id: string; // UUID de la organización
  full_name: string; // Nombre completo del usuario
  email: string; // Email del usuario
  role: UserRole; // Rol en el sistema
  photo_url?: string; // URL de la foto de perfil
  fcm_token?: string; // Token para push notifications
  created_at: string; // Fecha de creación (ISO 8601)
  updated_at: string; // Última actualización (ISO 8601)
}

type UserRole = "owner_admin" | "superintendent" | "resident" | "cabo";
```

### Diagrama de Relaciones

```
┌─────────────────┐
│   auth.users    │
│   (Supabase)    │
└────────┬────────┘
         │ 1
         │
         │ PK/FK
         ▼ 1
┌─────────────────┐         ┌─────────────────┐
│    profiles     │────────►│  organizations  │
│                 │   N:1   │                 │
│ - id (PK/FK)    │         │ - id (PK)       │
│ - organization_id│        │ - name          │
│ - full_name     │         │ - subscription  │
│ - email         │         └─────────────────┘
│ - role          │
│ - photo_url     │
│ - fcm_token     │
│ - created_at    │
│ - updated_at    │
└─────────────────┘
```

---

## 🗃️ Esquema de Base de Datos

### Tabla: `profiles`

```sql
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    role user_role NOT NULL,
    photo_url TEXT,
    fcm_token TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Enum: `user_role`

```sql
CREATE TYPE user_role AS ENUM (
  'owner_admin',      -- Administrador de organización
  'superintendent',   -- Superintendente de obra
  'resident',         -- Residente de obra
  'cabo'              -- Cabo de obra
);
```

### Row Level Security (RLS)

```sql
-- Los usuarios solo pueden ver perfiles de su organización
CREATE POLICY "Users can view profiles in their org"
ON profiles FOR SELECT
USING (organization_id = get_user_org());

-- Los usuarios solo pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (id = auth.uid());
```

---

## 🎨 Variables CSS Utilizadas

```css
/* Colores */
--text-primary        /* Color de texto principal */
--text-secondary      /* Color de texto secundario */
--text-muted          /* Color de texto deshabilitado */
--accent-primary      /* Color de acento (badges, botones) */
--accent-danger       /* Color de error */
--accent-success      /* Color de éxito */

/* Espaciado */
--space-1 a --space-6 /* Unidades de espaciado */

/* Tipografía */
--text-xs a --text-2xl  /* Tamaños de fuente */
--font-medium           /* Peso medio */
--font-semibold         /* Peso semi-negrita */
--font-bold             /* Peso negrita */

/* Bordes y Fondos */
--bg-surface        /* Fondo de cards */
--bg-base           /* Fondo de inputs disabled */
--border-subtle     /* Borde sutil */
--radius-sm/md/xl   /* Radio de bordes */
```

---

## 🔐 Seguridad

### Validaciones del Lado del Servidor

1. **Autenticación**: El middleware verifica el token de sesión antes de permitir acceso
2. **Autorización**: Solo el usuario puede editar su propio perfil (`id = auth.uid()`)
3. **Sanitización**: Los datos del formulario se procesan como strings
4. **RLS**: Supabase valida permisos a nivel de fila

### Campos Protegidos

Los siguientes campos NO pueden ser modificados por el usuario:

- `email` - Gestionado por Supabase Auth
- `role` - Solo modificable por administradores
- `organization_id` - Asignado al crear la cuenta
- `created_at` - Timestamp inmutable

---

## 📱 Responsive Design

```css
@media (max-width: 480px) {
  .profile-header {
    flex-direction: column; /* Avatar arriba del nombre */
    text-align: center;
  }

  .profile-info {
    align-items: center; /* Centra el contenido */
  }
}
```

---

_Documentación del módulo de Perfil - STROP Web Admin_

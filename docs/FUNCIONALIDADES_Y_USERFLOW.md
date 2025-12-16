# STROP Web Admin - Funcionalidades y User Flow

## 📋 Descripción General

**STROP Web Admin** es un sistema de administración web para la gestión de incidencias en proyectos de construcción. Está construido con:

- **Frontend:** Astro + React + TypeScript
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Estado:** Nanostores
- **Animaciones:** Framer Motion

---

## 🏗️ Arquitectura del Sistema

### Multi-tenancy (Organizaciones)

El sistema soporta múltiples organizaciones. Cada usuario pertenece a una organización y solo puede ver/editar datos de su propia organización.

### Roles de Usuario

| Rol              | Descripción                      | Permisos                              |
| ---------------- | -------------------------------- | ------------------------------------- |
| `owner_admin`    | Administrador de la organización | Todos los permisos, gestión de equipo |
| `superintendent` | Superintendente de obra          | Gestión de proyectos e incidencias    |
| `resident`       | Residente de obra                | Crear/ver incidencias                 |
| `cabo`           | Cabo de obra                     | Crear incidencias básicas             |

---

## 🔐 Módulo de Autenticación

### Páginas

- `/login` - Inicio de sesión
- `/registro` - Registro de nueva cuenta
- `/forgot-password` - Recuperar contraseña
- `/reset-password` - Restablecer contraseña

### Flujo de Autenticación

```
┌─────────────────┐
│   Usuario       │
│   visita /      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     NO      ┌─────────────────┐
│  ¿Tiene token   │────────────►│   /login        │
│  de sesión?     │             └────────┬────────┘
└────────┬────────┘                      │
         │ SÍ                            │
         ▼                               ▼
┌─────────────────┐             ┌─────────────────┐
│  Validar token  │             │  Credenciales   │
│  con Supabase   │             │  válidas?       │
└────────┬────────┘             └────────┬────────┘
         │                               │ SÍ
         ▼                               ▼
┌─────────────────┐             ┌─────────────────┐
│   /dashboard    │◄────────────│  Set cookies    │
│                 │             │  sb-access-token│
└─────────────────┘             └─────────────────┘
```

### Características

- ✅ Login con email/password
- ✅ Tokens JWT en cookies HttpOnly
- ✅ Refresh automático de tokens
- ✅ Middleware de protección de rutas
- ✅ Modo Mock para desarrollo sin backend

---

## 📊 Módulo Dashboard

### Página: `/dashboard`

### Componentes Principales

1. **TopInsightsPanel** - KPIs y métricas rápidas
2. **HeatmapGrid** - Matriz visual de proyectos
3. **ProjectSidePanel** - Panel lateral con detalles del proyecto

### HeatmapGrid (Matriz de Proyectos)

Visualización tipo "heatmap" donde cada celda representa un proyecto:

| Estado       | Color    | Significado                              |
| ------------ | -------- | ---------------------------------------- |
| 🔴 Crítico   | Rojo     | Tiene incidencias críticas abiertas      |
| 🟡 Pendiente | Amarillo | Tiene incidencias pendientes de revisión |
| ⚪ OK        | Gris     | Sin incidencias pendientes               |
| ⬛ Inactivo  | Oscuro   | Proyecto pausado/cancelado               |

### Navegación por Teclado

| Tecla     | Acción                   |
| --------- | ------------------------ |
| `↑ ↓ ← →` | Navegar entre proyectos  |
| `Enter`   | Abrir panel de detalles  |
| `T`       | Ir a triage del proyecto |
| `Ctrl+K`  | Abrir Command Palette    |

### User Flow - Dashboard

```
┌─────────────────────────────────────────────────────────┐
│                    DASHBOARD                            │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐   │
│  │     KPIs: Críticos | Pendientes | Proyectos     │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────┐  ┌───────────────────────┐   │
│  │  MATRIZ PROYECTOS   │  │   SIDE PANEL          │   │
│  │  ┌───┬───┬───┬───┐  │  │                       │   │
│  │  │ 🔴│ 🟡│ ⚪│ 🟡│  │  │  Proyecto: Torre A    │   │
│  │  ├───┼───┼───┼───┤  │  │  Estado: Activo       │   │
│  │  │ ⚪│ 🔴│ 🟡│ ⚪│  │  │  Incidencias: 5       │   │
│  │  ├───┼───┼───┼───┤  │  │                       │   │
│  │  │ 🟡│ ⚪│ ⚪│ ⬛│  │  │  [Ver Triage]         │   │
│  │  └───┴───┴───┴───┘  │  │  [Ver Detalles]       │   │
│  └─────────────────────┘  └───────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 🚨 Módulo de Triage

### Página: `/triage`

### Propósito

Sistema de revisión rápida de incidencias pendientes, inspirado en interfaces tipo "swipe" (Tinder-style).

### Modos de Visualización

1. **Light Mode (Stack)** - Tarjetas apiladas con gestos de deslizamiento
2. **Dense Mode (Table)** - Vista de tabla para revisión masiva

### Acciones de Triage

| Gesto/Tecla       | Acción   | Resultado                        |
| ----------------- | -------- | -------------------------------- |
| Deslizar ➡️ / `A` | Aprobar  | Marca como `approved`            |
| Deslizar ⬅️ / `R` | Rechazar | Marca como `rejected`            |
| Deslizar ⬇️ / `S` | Saltar   | Pasa a la siguiente sin decisión |
| `Espacio`         | Expandir | Ver más detalles de la tarjeta   |
| `D`               | Detalle  | Ir a página de detalle completo  |
| `Ctrl+Z`          | Deshacer | Revierte la última acción        |

### Estructura de Tarjeta Triage

```
┌────────────────────────────────────────┐
│  🏗️ Proyecto: Torre Magna              │
│                                        │
│  ⚠️ CRÍTICO                            │
│                                        │
│  Título: Fisura en columna C-12        │
│  Tipo: Problema                        │
│  Reportado: 12 Dic 2025, 10:30         │
│                                        │
│  📷 [3 fotos]                          │
│                                        │
│  ┌────────────────────────────────┐    │
│  │ ❌ Rechazar │ ⏭️ Saltar │ ✅ Aprobar │
│  └────────────────────────────────┘    │
└────────────────────────────────────────┘
```

### User Flow - Triage

```
        ┌───────────────────┐
        │ Incidencias       │
        │ Pendientes        │
        └─────────┬─────────┘
                  │
                  ▼
        ┌───────────────────┐
        │ Revisar Tarjeta   │
        │                   │
        └─────────┬─────────┘
                  │
     ┌────────────┼────────────┐
     │            │            │
     ▼            ▼            ▼
┌─────────┐ ┌─────────┐ ┌─────────┐
│ Aprobar │ │ Saltar  │ │Rechazar │
└────┬────┘ └────┬────┘ └────┬────┘
     │           │           │
     ▼           │           ▼
┌─────────┐      │     ┌─────────┐
│approved │      │     │rejected │
│+ log    │      │     │+ log    │
└────┬────┘      │     └────┬────┘
     │           │           │
     └───────────┼───────────┘
                 ▼
        ┌───────────────────┐
        │ Siguiente         │
        │ Incidencia        │
        └───────────────────┘
```

---

## 📁 Módulo de Proyectos

### Páginas

- `/proyectos` - Listado de proyectos
- `/proyectos/nuevo` - Crear nuevo proyecto
- `/proyectos/[id]` - Detalle del proyecto

### Crear Proyecto

Dos métodos disponibles:

#### 1. Importación desde Excel

- Arrastra o selecciona archivo Excel
- Preview de datos parseados
- Creación masiva de proyectos

#### 2. Formulario Manual

- Nombre del proyecto
- Cliente
- Dirección
- Fecha inicio y fin estimada
- Descripción

### Estados de Proyecto

| Estado      | Descripción                    |
| ----------- | ------------------------------ |
| `active`    | Proyecto en curso              |
| `paused`    | Proyecto pausado temporalmente |
| `completed` | Proyecto finalizado            |
| `cancelled` | Proyecto cancelado             |

### User Flow - Crear Proyecto

```
┌─────────────────┐
│ /proyectos/nuevo│
└────────┬────────┘
         │
         ├─────────────────────────────┐
         │                             │
         ▼                             ▼
┌─────────────────┐           ┌─────────────────┐
│ Tab: Excel      │           │ Tab: Manual     │
│                 │           │                 │
│ [Dropzone]      │           │ [Formulario]    │
│ Arrastra .xlsx  │           │ - Nombre        │
│                 │           │ - Cliente       │
└────────┬────────┘           │ - Fechas        │
         │                    └────────┬────────┘
         ▼                             │
┌─────────────────┐                    │
│ Preview datos   │                    │
│ [Confirmar]     │                    │
└────────┬────────┘                    │
         │                             │
         └──────────────┬──────────────┘
                        ▼
               ┌─────────────────┐
               │ POST /api/      │
               │ projects        │
               └────────┬────────┘
                        │
                        ▼
               ┌─────────────────┐
               │ Redirect        │
               │ /proyectos      │
               └─────────────────┘
```

---

## 🔍 Módulo de Incidencias

### Páginas

- `/incidencias/[id]` - Detalle de incidencia

### Tipos de Incidencia

| Tipo               | Descripción            |
| ------------------ | ---------------------- |
| `progress_report`  | Reporte de avance      |
| `problem`          | Problema identificado  |
| `consultation`     | Consulta técnica       |
| `safety_incident`  | Incidente de seguridad |
| `material_request` | Solicitud de material  |

### Estados de Aprobación

| Estado     | Descripción            |
| ---------- | ---------------------- |
| `pending`  | Pendiente de revisión  |
| `approved` | Aprobada               |
| `rejected` | Rechazada              |
| `assigned` | Asignada a responsable |

### Componentes de Detalle

1. **Información básica** - Título, descripción, tipo
2. **PhotoGallery** - Galería de fotos con lightbox
3. **ActivityTimeline** - Historial inmutable de acciones

### User Flow - Ver Incidencia

```
┌─────────────────────────────────────────────────────────┐
│                DETALLE INCIDENCIA                       │
├─────────────────────────────────────────────────────────┤
│  ← Volver a Triage                                      │
│                                                         │
│  Fisura en columna C-12            [CRÍTICO] [pending]  │
│  Proyecto: Torre Magna                                  │
│  Reportado: 12 Dic 2025                                 │
│                                                         │
│  ┌─────────────────────────┐  ┌───────────────────────┐│
│  │ DESCRIPCIÓN             │  │ TIMELINE              ││
│  │                         │  │                       ││
│  │ Se detectó fisura de    │  │ 🟢 Creado por Juan   ││
│  │ 2cm en la columna C-12  │  │    12 Dic, 10:30     ││
│  │ del nivel 3.            │  │                       ││
│  │                         │  │ 🔵 Asignado a Pedro  ││
│  ├─────────────────────────┤  │    12 Dic, 11:00     ││
│  │ FOTOS (3)               │  │                       ││
│  │ ┌─────┐ ┌─────┐ ┌─────┐ │  │ 💬 Comentario...     ││
│  │ │ 📷  │ │ 📷  │ │ 📷  │ │  │    12 Dic, 14:30     ││
│  │ └─────┘ └─────┘ └─────┘ │  └───────────────────────┘│
│  └─────────────────────────┘                           │
└─────────────────────────────────────────────────────────┘
```

---

## 📜 Módulo Bitácora

### Página: `/bitacora`

### Propósito

Registro **inmutable** de todas las acciones realizadas en el sistema. Cumple con requisitos SRS de auditoría.

### Tipos de Acción Registrados

- `created` - Incidencia creada
- `assigned` - Incidencia asignada
- `status_change` - Cambio de estado
- `comment` - Comentario agregado
- `approved` - Incidencia aprobada
- `rejected` - Incidencia rechazada

### Características

- ✅ Solo lectura (INSERT only en la BD)
- ✅ Incluye snapshot de datos en `details`
- ✅ Timestamp preciso de cada acción
- ✅ Referencia al actor que realizó la acción

---

## ⚙️ Módulo de Configuración

### Página: `/configuracion`

### Secciones

#### 1. Organización

- Editar nombre de la organización

#### 2. Gestión de Equipo

- Ver miembros del equipo
- Cambiar roles de usuarios
- Remover miembros

### Permisos

Solo usuarios con rol `owner_admin` pueden:

- Modificar configuración de organización
- Gestionar roles del equipo

---

## 👤 Módulo de Perfil

### Páginas

- `/perfil` - Ver/editar perfil personal

### Campos Editables

- Nombre completo
- Foto de perfil

---

## ⌨️ Atajos de Teclado Globales

### Página: `/atajos`

### Atajos Disponibles

| Atajo          | Acción                |
| -------------- | --------------------- |
| `Ctrl/Cmd + K` | Abrir Command Palette |
| `?`            | Ver atajos de teclado |
| `G + D`        | Ir a Dashboard        |
| `G + P`        | Ir a Proyectos        |
| `G + T`        | Ir a Triage           |
| `G + B`        | Ir a Bitácora         |
| `Esc`          | Cerrar modal/panel    |

---

## 🎨 Sistema de UI

### Modos de Vista

| Modo    | Descripción                      |
| ------- | -------------------------------- |
| `light` | Vista rápida, menos detalles     |
| `dense` | Vista detallada, más información |

### Componentes Compartidos

- **CollapsibleRail** - Barra lateral colapsable
- **CommandPalette** - Búsqueda rápida estilo Spotlight
- **Toast** - Notificaciones temporales con acciones
- **Skeleton** - Placeholders de carga

### Indicadores en Tiempo Real

- **RealtimeIndicator** - Muestra estado de conexión Supabase Realtime

---

## 🔄 Flujo de Datos

### Arquitectura de Estados (Nanostores)

```
┌─────────────────────────────────────────────────────────┐
│                      STORES                             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  auth.ts          projects.ts        incidents.ts       │
│  ┌──────────┐     ┌──────────────┐  ┌──────────────┐   │
│  │$userProfile│    │$projects     │  │$incidents    │   │
│  │$isAuthenticated│$selectedProjectId│$triageQueue  │   │
│  │$isAdmin   │    │$projectStats │  │$currentIndex │   │
│  └──────────┘     └──────────────┘  └──────────────┘   │
│                                                         │
│  ui.ts            insights.ts                           │
│  ┌──────────────┐ ┌──────────────┐                     │
│  │$viewMode     │ │$criticalCount│                     │
│  │$sidePanelOpen│ │$pendingCount │                     │
│  │$toasts      │ │              │                     │
│  └──────────────┘ └──────────────┘                     │
└─────────────────────────────────────────────────────────┘
```

### Servicio de Datos (dataService.ts)

```
┌─────────────────┐     ┌─────────────────┐
│   Componentes   │────▶│  dataService    │
│   React/Astro   │◀────│                 │
└─────────────────┘     └────────┬────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
           ┌─────────────────┐       ┌─────────────────┐
           │  Mock Data      │       │    Supabase     │
           │  (Desarrollo)   │       │  (Producción)   │
           └─────────────────┘       └─────────────────┘
```

---

## 🌐 API Endpoints

### `/api/projects`

| Método | Acción   | Descripción                  |
| ------ | -------- | ---------------------------- |
| POST   | `create` | Crear un proyecto            |
| POST   | `import` | Importar múltiples proyectos |

### `/api/incidents`

| Método | Acción    | Descripción         |
| ------ | --------- | ------------------- |
| GET    | -         | Listar incidencias  |
| POST   | `create`  | Crear incidencia    |
| PATCH  | `approve` | Aprobar incidencia  |
| PATCH  | `reject`  | Rechazar incidencia |

---

## 🗄️ Esquema de Base de Datos

### Tablas Principales

```
organizations ──┬── profiles
                │
                ├── projects ──── project_members
                │       │
                │       └── project_schedule_items
                │
                └── incidents ──┬── incident_photos
                                │
                                └── incident_activity_log
```

### Row Level Security (RLS)

- Todas las tablas principales tienen RLS habilitado
- Los usuarios solo ven datos de su organización
- Función helper: `get_user_org()` para validar pertenencia

---

## 📱 Consideraciones Mobile

### Características para Sincronización

- Campos `updated_at` en todas las tablas
- Soporte para modo offline (futuro)
- FCM tokens en perfiles para push notifications

---

## 🚀 Flujo Completo de Usuario Típico

```
┌─────────────────────────────────────────────────────────────────────┐
│                     FLUJO USUARIO ADMINISTRADOR                      │
└─────────────────────────────────────────────────────────────────────┘

1. LOGIN
   Usuario ingresa credenciales → Validación → Dashboard

2. DASHBOARD (Vista General)
   Ver matriz de proyectos → Identificar proyectos críticos (rojos)
   → Seleccionar proyecto → Ver panel lateral con estadísticas

3. TRIAGE (Revisión Rápida)
   Ir a Triage del proyecto → Revisar incidencias una por una
   → Aprobar/Rechazar con gestos → Deshacer si es necesario

4. DETALLE DE INCIDENCIA
   Desde Triage presionar D → Ver fotos en galería
   → Leer historial de actividad → Tomar decisión informada

5. GESTIÓN DE PROYECTOS
   Ir a /proyectos → Ver lista → Crear nuevo proyecto
   → Importar desde Excel o crear manualmente

6. BITÁCORA (Auditoría)
   Ir a /bitacora → Ver registro de todas las acciones
   → Filtrar por fecha/tipo si es necesario

7. CONFIGURACIÓN
   Ir a /configuracion → Gestionar equipo
   → Cambiar roles → Invitar nuevos miembros
```

---

## 📝 Notas de Desarrollo

### Modo Mock

Activar con variable de entorno:

```
PUBLIC_USE_MOCK_DATA=true
```

Esto permite:

- Desarrollo sin conexión a Supabase
- Testing de flujos completos
- Datos de ejemplo consistentes

### Tecnologías Clave

- **Astro** - SSR y routing
- **React** - Componentes interactivos
- **Nanostores** - Estado global ligero
- **Framer Motion** - Animaciones fluidas
- **Supabase** - Backend as a Service

---

_Documento generado automáticamente - STROP Web Admin v1.0_

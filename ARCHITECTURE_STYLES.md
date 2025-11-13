# Arquitectura de Estilos - Strop

## Estructura Modular

Los estilos del proyecto están organizados en una arquitectura modular que separa las responsabilidades y facilita el mantenimiento.

### 📁 Organización de Archivos

```
src/styles/
├── _colors.css          # Paleta de colores (variables CSS)
├── _typografi.css       # Tipografía base y estilos de texto
├── global.css           # Estilos base globales + Tailwind
├── dashbord.css         # Estilos específicos del dashboard
└── login.css            # Estilos de login y registro
```

### 🎨 Archivos Base

#### `_colors.css`

Define toda la paleta de colores del sistema mediante variables CSS:

- **Marca**: `--color-primary`, `--color-secondary`
- **Semánticos**: `--color-danger`, `--color-warning`, `--color-success`, `--color-info`
- **Neutrales**: `--color-text`, `--color-text-secondary`, `--color-border`, `--color-bg-light`, `--color-bg-white`

#### `_typografi.css`

Define la tipografía del sistema:

- Familias de fuentes
- Tamaños (`--font-size-xs` hasta `--font-size-3xl`)
- Pesos (`--font-weight-normal` hasta `--font-weight-extrabold`)
- Alturas de línea
- Estilos base para headings, párrafos, enlaces

#### `global.css`

Contiene:

- Directivas de Tailwind (`@tailwind base`, `@tailwind components`, `@tailwind utilities`)
- Reset básico (html, body, box-sizing)
- Utilidades compartidas (`.avatar`, `.card`)

### 📄 Archivos Específicos de Página

#### `dashbord.css`

Estilos exclusivos del dashboard:

- Layout del dashboard (grid, sidebar, topbar)
- Navegación lateral
- Sección de estado del proyecto
- Tabla de incidencias
- Sidebar derecho (control de costos, resumen)
- Responsive para móviles

#### `login.css`

Estilos de autenticación (login y registro):

- Layout de dos columnas (auth-left, auth-right)
- Formularios
- Botones primarios y Google
- Responsive para móviles

### 🔗 Importación en Páginas

#### Layout Principal (`src/layouts/Layout.astro`)

```astro
---
import "../styles/_colors.css";
import "../styles/_typografi.css";
import "../styles/global.css";
---
```

#### Dashboard (`src/pages/dashbord/index.astro`)

```astro
---
import "../../styles/dashbord.css";
---
```

#### Login/Register (`src/pages/login/index.astro`, `src/pages/register/index.astro`)

```astro
---
import "../../styles/login.css";
---
```

## 🎯 Principios de Diseño

1. **Separación de Responsabilidades**

   - Los colores y tipografía están centralizados en `_colors.css` y `_typografi.css`
   - Cada página importa solo los estilos que necesita

2. **Variables CSS**

   - Todos los colores y valores tipográficos usan variables CSS
   - Facilita cambios globales y futuros temas (modo oscuro)

3. **Modularidad**

   - Los estilos específicos de cada sección están en archivos dedicados
   - Evita conflictos y facilita el mantenimiento

4. **Orden de Importación**
   - Primero: `_colors.css` (variables)
   - Segundo: `_typografi.css` (tipografía base)
   - Tercero: `global.css` (Tailwind y reset)
   - Cuarto: Estilos específicos de página

## 🔧 Cómo Hacer Cambios

### Cambiar un Color

1. Editar `src/styles/_colors.css`
2. Actualizar la variable correspondiente (ej: `--color-primary: #0A58A3;`)
3. El cambio se reflejará automáticamente en toda la aplicación

### Cambiar Tipografía

1. Editar `src/styles/_typografi.css`
2. Actualizar las variables de fuente o tamaños
3. Los cambios se aplicarán globalmente

### Agregar Estilos a una Página Nueva

1. Crear un nuevo archivo CSS en `src/styles/` (ej: `projects.css`)
2. Usar variables de `_colors.css` y `_typografi.css`
3. Importar el archivo en la página correspondiente:
   ```astro
   ---
   import "../../styles/projects.css";
   ---
   ```

### Modificar Estilos del Dashboard

1. Editar `src/styles/dashbord.css`
2. Usar variables CSS cuando sea posible
3. El hot-reload actualizará automáticamente

## 📝 Notas Técnicas

- **Tailwind**: Las directivas `@tailwind` están en `global.css` y se aplican globalmente
- **PostCSS**: El proyecto usa PostCSS para procesar Tailwind y las variables CSS
- **Hot Reload**: Los cambios en archivos CSS se reflejan automáticamente durante desarrollo
- **Lint Warnings**: Los warnings de `@tailwind` en el editor son esperados (el linter no conoce las directivas de Tailwind)

## ✅ Ventajas de esta Arquitectura

1. **Mantenibilidad**: Cada archivo tiene una responsabilidad clara
2. **Escalabilidad**: Fácil agregar nuevas páginas con sus propios estilos
3. **Consistencia**: Variables CSS garantizan coherencia visual
4. **Performance**: Solo se cargan los estilos necesarios para cada página
5. **Colaboración**: Múltiples desarrolladores pueden trabajar sin conflictos

---

**Última actualización**: Noviembre 12, 2025

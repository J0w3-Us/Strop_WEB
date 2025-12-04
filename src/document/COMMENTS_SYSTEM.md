# Sistema de Comentarios Dinámicos

Este documento describe la nueva arquitectura de comentarios implementada para sincronizar con el modelo de la App Móvil.

## Archivos Creados/Modificados

### 1. `src/types/index.ts`

- ✅ **Interfaz `Comment`** añadida con los campos:
  - `id`: Identificador único del comentario
  - `incidentId`: Referencia a la incidencia
  - `authorName`: Nombre del autor
  - `authorRole`: Rol del autor (`Admin`, `Superintendente`, `Capataz`, `Operario`, `Cliente`)
  - `content`: Contenido del mensaje
  - `createdAt`: Timestamp en ISO format
  - `isSystemMessage`: Flag para mensajes automáticos (ej: "Estado cambiado a Cerrado")

### 2. `src/service/comment.service.ts` (NUEVO)

Servicio que simula una API REST con las siguientes funciones:

#### `getCommentsByIncidentId(incidentId: string): Promise<Comment[]>`

- Carga todos los comentarios de una incidencia
- Simula delay de 500ms para reflejar latencia de red
- Devuelve datos mock pero realistas

#### `postComment(incidentId: string, content: string): Promise<Comment>`

- Crea un nuevo comentario
- Retorna el comentario con timestamp actual
- Simula delay de envío (500ms)

#### `getCommentById(commentId: string): Promise<Comment | null>`

- Obtiene un comentario específico por ID

#### `deleteComment(commentId: string): Promise<boolean>`

- Elimina un comentario (preparado para validaciones de admin en el futuro)

### 3. `src/components/incidents/CommentsWidget.astro` (NUEVO)

Componente interactivo que reemplaza la UI estática de comentarios.

**Props:**

- `incidentId`: ID de la incidencia (requerido)
- `incidentTitle`: Título de la incidencia (opcional, solo informativo)

**Características:**

- ✅ **Lazy Loading**: Muestra spinner mientras carga comentarios (500ms)
- ✅ **Chat Moderno**: Mensajes propios a la derecha, ajenos a la izquierda
- ✅ **Mensajes del Sistema**: Con estilo diferenciado (itálica, punteado)
- ✅ **Input Dinámico**: Campo de texto + botón enviar
- ✅ **Enter para Enviar**: Puedes presionar Enter para enviar (Shift+Enter para nueva línea)
- ✅ **Timestamps Inteligentes**: "Hace 5m", "Hace 2h", etc.
- ✅ **Animaciones**: Slide-in suave para nuevos mensajes
- ✅ **Sin Recargar**: Todo sucede sin refrescar la página

## Uso en Páginas

### En `src/pages/proyectos/[projectId].astro`

```astro
import CommentsWidget from "../../components/incidents/CommentsWidget.astro";

// En el template, dentro de la sección de comentarios:
<div class="comments">
  <h5>Comentarios</h5>
  <CommentsWidget incidentId={selected.id} incidentTitle={selected.title} />
</div>
```

## Integración con Aprobaciones

- Los comentarios son **independientes** de las aprobaciones
- Las aprobaciones (Aprobar/Rechazar) se guardan en localStorage bajo `strop_incident_approvals`
- Los comentarios se cargan dinámicamente y se persisten en el mock service (futuro: backend)

## Flujo de Datos

```
Página Proyecto
    ↓
CommentsWidget (mounted)
    ↓
getCommentsByIncidentId() [500ms delay]
    ↓
Renderizar burbujas
    ↓
Usuario escribe + Enter/Click Enviar
    ↓
postComment() [500ms delay]
    ↓
Nuevo comentario aparece en la lista
```

## Mock Data

El servicio incluye comentarios de prueba para 3 incidencias:

- `inc-001`: 2 comentarios de Laura Paez y Ricardo Gomez
- `inc-002`: 1 mensaje del sistema
- `inc-003`: 1 comentario de Miguel Torres (Capataz)

Puedes agregar más comentarios en `mockCommentsByIncident` en `comment.service.ts`.

## Estilos (CSS)

Se añadieron estilos en `src/styles/dashbord.css`:

- `.comments-widget`: Contenedor principal
- `.messages-list`: Área de mensajes con scroll
- `.message`: Contenedor de cada mensaje
- `.message.own / .message.other / .message.system`: Estilos diferenciados
- `.comment-input-area`: Área de input
- Animaciones: `spin-loader`, `slideIn-msg`

## Próximos Pasos

1. **Backend Integration**:

   - Reemplazar mock service con llamadas reales a API
   - Autenticación de usuario para determinar si es "propio" o no

2. **Features Adicionales**:

   - Editar comentarios propios
   - Eliminar comentarios (admin only)
   - Menciones con @usuario
   - Adjuntos (fotos/documentos)
   - Notificaciones en tiempo real (WebSocket)

3. **Persistencia**:
   - Actualmente usa localStorage local
   - Implementar backend persistence

## Troubleshooting

**Los comentarios no cargan**

- Verifica que `incidentId` sea válido
- Abre DevTools y revisa la consola para errores

**El componente aparece vacío**

- Asegúrate de que `CommentsWidget` esté importado correctamente
- Verifica que el ID sea uno de: `inc-001`, `inc-002`, `inc-003` (para mocks)

**El input no responde**

- Recarga la página (el script se carga en `DOMContentLoaded`)
- Verifica que no haya errores en la consola

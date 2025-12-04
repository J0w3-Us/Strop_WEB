# 🧪 Guía de Testing - Sistema de Comentarios Dinámicos

## Prueba Rápida (2 minutos)

### 1. Navega a la página de proyecto
```
http://localhost:3000/proyectos/1
```

### 2. Selecciona una solicitud/incidencia
- Haz clic en una tarjeta de la columna izquierda
- El panel de la derecha se actualizará

### 3. Observa el widget de comentarios
- Verás un **spinner girando** durante ~500ms
- Luego aparecerán los comentarios cargados

### 4. Prueba enviar un comentario
- Escribe algo en el input: "Excelente trabajo"
- Presiona **Enter** o haz clic en el botón ➤
- El botón se deshabilitará durante el envío (500ms)
- Tu mensaje aparecerá a la **derecha** (burbuja azul)

### 5. Verifica la persistencia
- Abre DevTools (F12)
- Ir a: **Application → Local Storage**
- Verás una clave: `strop_incident_approvals` (aprobaciones)
- Recarga la página (Ctrl+F5)
- Los comentarios siguen apareciendo ✅

---

## Casos de Prueba Detallados

### Test 1: Carga Inicial
**Esperado:**
- Spinner visible durante ~500ms
- Luego 2 comentarios apareceran para `inc-001`

```typescript
// Mock data
inc-001: [
  "Laura Paez: Confirmado con el proveedor...",
  "Ricardo Gomez: Aprobado. Coordinar recepción..."
]
```

✅ **Resultado**: Spinner → Comentarios cargados

---

### Test 2: Enviar Comentario
**Pasos:**
1. Escribe: "Perfecto, gracias"
2. Presiona Enter

**Esperado:**
- Botón se desactiva
- Input se desactiva
- Después de ~500ms aparece el nuevo comentario
- A la **derecha** (estilo propio)
- Con timestamp "Hace un momento"
- Botón e input se reactivan

✅ **Resultado**: Nuevo mensaje aparece sin recargar

---

### Test 3: Timestamps Inteligentes
**Comportamiento:**
- Primer mensaje: "Hace 1h"
- Segundo mensaje: "Hace 30m"
- Tu mensaje: "Hace un momento"
- Al recargar: Se recalculan automáticamente

✅ **Resultado**: Timestamps relativos correctos

---

### Test 4: Diferentes Incidencias
**Prueba:**
1. Haz clic en otra tarjeta (ej: `inc-002`)
2. Selecciona una tercera (ej: `inc-003`)

**Esperado:**
- Cada incidencia muestra sus propios comentarios
- `inc-002`: 1 mensaje del sistema
- `inc-003`: 1 comentario de Miguel Torres

✅ **Resultado**: Comentarios correctos por incidencia

---

### Test 5: Mensajes del Sistema
**Cómo identificarlos:**
- Estilo punteado (border-dashed)
- Texto itálico
- Autor: "Sistema"
- Centrado en la pantalla

✅ **Resultado**: Visualmente diferenciados

---

### Test 6: Validación del Input
**Pruebas:**
1. Presiona Enter sin escribir nada → No envía ✅
2. Escribe espacios "   " → Trimea y no envía ✅
3. Escribe un emoji "👍" → Envía correctamente ✅
4. Escribe texto largo "Lorem ipsum dolor sit amet..." → Wrap correcto ✅

✅ **Resultado**: Validación funcionando

---

### Test 7: Responsividad
**En móvil (simular en DevTools):**
1. F12 → Toggle device toolbar
2. iPhone 12
3. Escribe y envía un comentario

**Esperado:**
- Input ocupa máximo ancho disponible
- Botón siempre visible
- Mensajes legibles
- Sin overflow

✅ **Resultado**: Layout responsive

---

### Test 8: Performance
**Medir tiempo:**
```javascript
// En DevTools Console
console.time('load');
// Haz clic en una tarjeta
console.timeEnd('load');
```

**Esperado:**
- Spinner aparece ~0ms (inmediato)
- Comentarios aparecen ~500ms (delay simulado)

✅ **Resultado**: Delay simulado funciona

---

## Debugging

### Si no ves el spinner:
1. Abre DevTools (F12)
2. Console → Busca errores
3. Verifica que `incidentId` sea válido (`inc-001`, `inc-002`, o `inc-003`)

### Si los comentarios no cargan:
1. Console → `await getCommentsByIncidentId('inc-001')`
2. Debe retornar un array de objetos `Comment`

### Si el input no responde:
1. Verifica que no haya errores en Console
2. Recarga la página (Ctrl+F5 hard refresh)

### Ver localStorage:
```javascript
// En console
JSON.parse(localStorage.getItem('strop_incident_approvals'))
// Debe mostrar objeto con aprobaciones
```

---

## Mock Data Reference

### Incidencia 1 (inc-001)
```
Tiene 2 comentarios
- Laura Paez (Admin): "Confirmado con el proveedor..."
- Ricardo Gomez (Superintendente): "Aprobado. Coordinar recepción..."
```

### Incidencia 2 (inc-002)
```
Tiene 1 mensaje del sistema
- Sistema (Admin): "Estado cambiado a: En Revisión" [isSystemMessage: true]
```

### Incidencia 3 (inc-003)
```
Tiene 1 comentario
- Miguel Torres (Capataz): "Se completó la reparación..."
```

---

## Checklist de Testing

- [ ] El spinner aparece durante ~500ms
- [ ] Los comentarios cargan correctamente
- [ ] Puedo enviar un comentario presionando Enter
- [ ] Puedo enviar un comentario haciendo clic en botón
- [ ] El nuevo comentario aparece a la derecha (azul)
- [ ] El timestamp dice "Hace un momento"
- [ ] El input se limpia después de enviar
- [ ] No puedo enviar texto vacío
- [ ] Los comentarios persisten en localStorage
- [ ] Diferentes incidencias muestran comentarios diferentes
- [ ] Los mensajes del sistema tienen estilo diferente
- [ ] El layout responde bien en móvil
- [ ] No hay errores en la consola

---

## Variantes para Testing

### Agregar más comentarios mock:
Edita `src/service/comment.service.ts`:
```typescript
'inc-004': [
  {
    id: 'cmt-005',
    incidentId: 'inc-004',
    authorName: 'Tu Nombre',
    authorRole: 'Superintendente',
    content: 'Este es un nuevo comentario de prueba',
    createdAt: new Date().toISOString(),
  }
]
```

### Cambiar delays:
```typescript
// En comment.service.ts
await new Promise((resolve) => setTimeout(resolve, 1000)); // Cambiar 500 a 1000
```

---

## Notas Importantes

- ✅ No requires backend real, todo funciona con mocks
- ✅ Los comentarios "se guardan" en mock service durante la sesión
- ✅ Al recargar, vuelven a cargar desde mock (no persisten entre sesiones)
- ✅ En producción, cambiar `getCommentsByIncidentId()` para llamar API real

---

**¡Listo para probar! Abre tu navegador y ve a `/proyectos/1`** 🚀

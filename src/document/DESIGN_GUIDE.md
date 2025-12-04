# 🎨 Visualización del Sistema de Comentarios

## Estado de Carga (Primeros 500ms)

```
┌────────────────────────────────────────┐
│            Comentarios                 │
├────────────────────────────────────────┤
│                                        │
│              ⟳ ↻                       │
│                                        │
│         Cargando comentarios...        │
│                                        │
│                                        │
└────────────────────────────────────────┘
```

---

## Comentarios Cargados

```
┌────────────────────────────────────────┐
│            Comentarios                 │
├────────────────────────────────────────┤
│                                        │
│  Laura Paez (Admin)                    │
│  ┌──────────────────────────────────┐  │
│  │ Confirmado con el proveedor.     │  │
│  │ La entrega será mañana a 10:00.  │  │
│  └──────────────────────────────────┘  │
│  Hace 1h                               │
│                                        │
│  Ricardo Gomez (Superintendente)       │
│  ┌──────────────────────────────────┐  │
│  │ Aprobado. Coordinar recepción    │  │
│  │ con el almacén.                  │  │
│  └──────────────────────────────────┘  │
│  Hace 30m                              │
│                                        │
├────────────────────────────────────────┤
│  [Escribe un comentario...] [➤]        │
└────────────────────────────────────────┘
```

---

## Después de Escribir y Enviar

```
┌────────────────────────────────────────┐
│            Comentarios                 │
├────────────────────────────────────────┤
│                                        │
│  Laura Paez (Admin)                    │
│  ┌──────────────────────────────────┐  │
│  │ Confirmado con el proveedor.     │  │
│  │ La entrega será mañana a 10:00.  │  │
│  └──────────────────────────────────┘  │
│  Hace 1h                               │
│                                        │
│  Ricardo Gomez (Superintendente)       │
│  ┌──────────────────────────────────┐  │
│  │ Aprobado. Coordinar recepción    │  │
│  │ con el almacén.                  │  │
│  └──────────────────────────────────┘  │
│  Hace 30m                              │
│                                        │
│                         Yo (Admin) ▲   │
│                    ┌──────────────┐    │
│                    │ Perfecto,    │    │
│                    │ gracias      │    │
│                    └──────────────┘    │
│                    Hace un momento     │
│                                        │
├────────────────────────────────────────┤
│  [Escribe un comentario...] [➤]        │
└────────────────────────────────────────┘
```

---

## Mensaje del Sistema (inc-002)

```
┌────────────────────────────────────────┐
│            Comentarios                 │
├────────────────────────────────────────┤
│                                        │
│  ┈┈┈┈┈ Sistema ┈┈┈┈┈                   │
│  ┈ Estado cambiado a: En Revisión ┈   │
│  ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈         │
│  Hace 2h                               │
│                                        │
├────────────────────────────────────────┤
│  [Escribe un comentario...] [➤]        │
└────────────────────────────────────────┘
```

---

## Paleta de Colores

| Elemento | Color | Código |
|----------|-------|--------|
| Burbuja propia | Azul | `#0a58a3` |
| Burbuja ajena | Gris claro | `#f0f0f0` |
| Burbuja sistema | Transparente | Con border punteado |
| Fondo | Gris muy claro | `#f8f9fa` |
| Input | Blanco | `#fff` |
| Texto | Oscuro | `#333` |
| Timestamps | Gris | `#999` |
| Botón | Azul | `#0a58a3` |
| Botón hover | Azul oscuro | `#084298` |

---

## Tipografía

| Elemento | Fuente | Tamaño | Peso |
|----------|--------|--------|------|
| Autor | System | 12px | 600 |
| Mensaje | System | 14px | 400 |
| Timestamp | System | 11px | 400 |
| Input | System | 14px | 400 |

---

## Bordes y Radio

| Elemento | Border | Border-radius |
|----------|--------|---------------|
| Widget | 1px solid #e0e0e0 | 8px |
| Burbuja | Ninguno | 12px |
| Input | 1px solid #ddd | 20px |
| Botón | Ninguno | 50% (círculo) |
| Burbuja sistema | 1px dashed #ddd | 12px |

---

## Espaciados

| Elemento | Padding | Margen |
|----------|---------|--------|
| Widget | - | - |
| Messages list | 16px | - |
| Message | - | 12px gap |
| Burbuja | 10px 14px | - |
| Input area | 12px | - |
| Input field | 10px 14px | - |

---

## Animaciones

### Spinner (Loader)
```
@keyframes spin-loader {
  from: { transform: rotate(0deg); }
  to:   { transform: rotate(360deg); }
}
Duration: 0.8s
Timing: linear
Iterations: infinite
```

### Slide In (Nuevo mensaje)
```
@keyframes slideIn-msg {
  from: { 
    opacity: 0;
    transform: translateY(10px);
  }
  to: { 
    opacity: 1;
    transform: translateY(0);
  }
}
Duration: 0.3s
Timing: ease-out
```

### Focus del Input
```
Transition: 0.2s
On focus:
  - border-color: #0a58a3
  - box-shadow: 0 0 0 3px rgba(10, 88, 163, 0.1)
```

---

## Estados del Botón Enviar

### Normal
```
Background: #0a58a3
Cursor: pointer
Transform: scale(1)
```

### Hover
```
Background: #084298
Transform: scale(1.05)
Transition: 0.2s
```

### Active (Click)
```
Transform: scale(0.95)
Transition: 0.05s
```

### Disabled (Enviando)
```
Background: #ccc
Cursor: not-allowed
Opacity: 0.6
Pointer-events: none
```

---

## Layout en Móvil (< 768px)

```
┌─────────────────────────┐
│    Comentarios          │
├─────────────────────────┤
│  Laura Paez             │
│  ┌──────────────────┐   │
│  │ Mensaje que     │   │
│  │ puede ocupar    │   │
│  │ más espacio en  │   │
│  │ móvil           │   │
│  └──────────────────┘   │
│  Hace 1h                │
│                         │
│         Yo             │
│    ┌───────────┐        │
│    │ Mi msg    │        │
│    └───────────┘        │
│    Hace un momento      │
│                         │
├─────────────────────────┤
│ [Escribe comenta...] [➤]│
└─────────────────────────┘
```

---

## Interactividad

### Input Focus
- Border color cambia a azul
- Box shadow azul suave
- Cursor en el campo

### Hover en botón
- Color más oscuro
- Escala +5%
- Efecto "presionable"

### Click en botón
- Escala -5%
- Feedback visual de presión
- Se desactiva durante envío

### Auto-scroll
- Cuando hay muchos mensajes, scroll va al final
- Nuevo mensaje visible automáticamente

---

## Accesibilidad

- ✅ Alt text en SVG del botón (aria-label)
- ✅ Input con placeholder descriptivo
- ✅ Colores con suficiente contraste (WCAG AA)
- ✅ Focus states visibles
- ✅ Labels implícitos (h5 "Comentarios")
- ✅ Semántica HTML correcta

---

## Casos de Uso Visual

### Múltiples Mensajes Consecutivos del Mismo Autor
```
Laura Paez (Admin)
┌──────────────────┐
│ Primer mensaje   │
└──────────────────┘

┌──────────────────┐
│ Segundo mensaje  │
└──────────────────┘

┌──────────────────┐
│ Tercer mensaje   │
└──────────────────┘
Hace 30m
```

### Conversación Activa
```
Autor A:  [Mensaje de Autor A]
Autor B:  [Mensaje de Autor B]
Yo:       [Mi respuesta]       → Azul, derecha
Autor A:  [Respuesta de A]     → Gris, izquierda
Yo:       [Mi seguimiento]     → Azul, derecha
```

---

## Indicadores Visuales

### Cargando
- Spinner girando continuamente
- Texto "Cargando comentarios..."
- Fondo gris claro

### Enviando
- Botón desactivo (gris)
- Input desactivo (no escribible)
- Spinner de envío (opcional - actualmente muestra burbuja)

### Éxito
- Botón se reactiva
- Input se limpia
- Nuevo mensaje aparece con animación

### Error (Futuro)
- Mensaje de error en rojo
- Opción de reintentar
- Input permanece habilitado

---

## Responsiveness

| Viewport | Max-width | Comportamiento |
|----------|-----------|----------------|
| Mobile | 480px | Burbujas ocupan 80%, input 100% |
| Tablet | 768px | Burbujas ocupan 70%, input 100% |
| Desktop | 1024px+ | Burbujas ocupan 65%, input 100% |

---

**Diseño optimizado para legibilidad y UX moderna tipo WhatsApp/Telegram** 💬

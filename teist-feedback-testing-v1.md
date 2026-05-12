# Teist — Feedback Testing v1
### Mayo 2026 · Para Claude Code

Instrucciones de uso:
- **Sección A** → Dev ejecuta directo, sin pasar por Speve
- **Sección B** → Speve valida primero, luego Dev ejecuta
- **Sección C** → Respuestas a preguntas de producto (contexto para Speve y Dev)

---

## SECCIÓN A — Bugs y fixes directos (Dev ejecuta sin Speve)

### A1. Imágenes — BLOQUEANTE
- [ ] Subida de imagen de logo en Branding no funciona
- [ ] Subida de imagen de portada en Branding no funciona
- [ ] Subida de imagen de ítem en editor de menú no funciona
- [ ] Revisar el flujo de Cloudflare Images direct upload — probablemente el endpoint `/api/cloudflare` está fallando o las variables de entorno no están configuradas en local

### A2. Splash screen — Editor de fondo
- [ ] **Color:** al seleccionar "Color" debe mostrarse un color picker (hex input + paleta de sugerencias). Actualmente no pasa nada.
- [ ] **Degradado:** al seleccionar "Degradado" debe mostrarse dos color pickers (color inicio y color fin). Actualmente no pasa nada.
- [ ] **Imagen:** funciona — agregar texto de recomendación de tamaño: *"Recomendamos imagen vertical, mínimo 1080×1920px"*
- [ ] **Patrón:** mover fuera del selector de tipo de fondo. El patrón es un overlay que se aplica ENCIMA de cualquier fondo (color, degradado o imagen). Mostrar como toggle separado: *"Aplicar patrón encima del fondo"* con selector de patrón disponible.
- [ ] **Guardar:** después de guardar, redirigir de vuelta al dashboard principal (o mostrar toast de confirmación + botón "Ver splash").

### A3. Navegación — Back arrows faltantes
- [ ] Agregar flecha/botón volver en: **Branding**, **Miembros**, **Analytics**
- [ ] Consistencia: todas las sub-páginas del dashboard deben tener el mismo patrón de navegación hacia atrás

### A4. Editor de menú — Bugs de UX
- [ ] **Visibilidad de categoría:** después de crear una categoría, hacer scroll automático hasta ella o resaltarla brevemente
- [ ] **Campo precio:**
  - Remover el 0 inicial automáticamente al hacer focus
  - Formatear automáticamente con punto de miles (ej: `13500` → `13.500`)
- [ ] **Moneda:** eliminar toda referencia a conversión de moneda. Solo CLP por ahora.

### A5. Terminología — Cambio global en admin
- [ ] Reemplazar "Plato" / "platos" por **"Ítem"** / "ítems" en todo el panel admin
- [ ] Aplica a: botones, labels, títulos, mensajes de confirmación, toasts, placeholders

### A6. SuperAdmin — Eliminar restaurante
- [ ] Agregar opción de eliminar en tabla `/admin/restaurants`
- [ ] Modal de confirmación antes de eliminar
- [ ] Soft delete recomendado: `is_active = false` en vez de borrar registro

---

## SECCIÓN B — Decisiones de producto (Speve valida primero)

### B1. Traducción automática de carta
**Contexto:** actualmente traducción es manual. ¿Teist debería traducir automáticamente con IA?

**Para Speve:** ¿v1 o v2?
- Feature significativa (Claude API por ítem, costo por uso)
- Segmento boutique de Santiago es mayoritariamente local
- Alternativa: botón "Traducir con IA" por ítem, el restaurante revisa antes de publicar

### B2. Calorías y tiempo de preparación
**Contexto:** campos existen pero Richi duda si son necesarios para el segmento boutique.

**Para Speve:** ¿ocultar, eliminar o mantener?
- Restaurante boutique de autor raramente publica calorías (eso es de cadenas/fast food)
- Opción: ocultar como "campos avanzados" optativos

### B3. Arquitectura del editor de menú
**Contexto:** no es obvia. Categorías difíciles de encontrar tras crearlas.

**Para Speve:** ¿rediseñar para v1 o post-primer cliente?
- Si Richi carga los menús él mismo (modelo servicio primero), el restaurante no usa el editor todavía
- Rediseño completo toma tiempo — ¿prioridad o workaround?

### B4. Opciones avanzadas de branding
**Contexto:** Richi quiere más personalización: más fuentes (Google Fonts), stroke de cards.

**Para Speve:** ¿cuánta personalización en v1?
- Google Fonts API: más opciones pero agrega latencia
- Stroke de cards: variable CSS simple, bajo costo
- Más opciones = más fricción en onboarding
- Alternativa: Teist elige la fuente por el cliente (modelo servicio), restaurante no toca eso

### B5. Formato de horarios
**Contexto:** horarios complejos (Lun–Vie 13:00–23:00, Sáb diferente, Dom cerrado).

**Para Speve:** ¿texto libre o estructura?
- Texto libre: flexible, inconsistente visualmente
- Estructura: robusto pero complejo de construir y usar
- Para v1 con modelo servicio, texto libre es suficiente

---

## SECCIÓN C — Respuestas a preguntas de producto

### C1. Miembros — ¿Cómo funciona?
1. Dueño invita colaborador por email desde dashboard
2. Colaborador recibe email de Supabase Auth con link de activación
3. Colaborador crea contraseña y accede al dashboard del restaurante
4. Ve lo mismo que el dueño pero solo de su restaurante

Baja prioridad para v1 donde Richi maneja los restaurantes él mismo.

### C2. SuperAdmin vs Admin
- **SuperAdmin** (Richi): `/admin` → todos los restaurantes, todos los usuarios
- **Admin/Owner** (restaurante): `/dashboard` → solo su restaurante

### C3. "Usuarios" en sidebar
Gestión de todos los usuarios del sistema (tabla `auth.users`). Solo visible para SuperAdmin. Vacío porque no hay usuarios registrados aún o la query no está conectada.

### C4. Analytics — Datos adicionales sugeridos
- Ítems más vistos (ranking con más clicks)
- Categorías más navegadas
- Horario pico de visitas (a qué hora escanean más)
- Tasa de rebote de splash (entran pero no presionan "Ver carta")
- Dispositivos (iOS vs Android)
- Sesiones únicas vs repetidas

---

## Notas técnicas para Dev (Sección A)

- Empezar por **A1 (imágenes)** — es bloqueante para todo lo demás
- **A5 (terminología)** es find & replace global — hacerlo de una vez
- **A2 (color picker):** usar `<input type="color">` nativo con campo hex editable encima. No instalar librerías externas.
- **A4 (precio):** lógica en `onChange`: `value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.')`

---

*Feedback v1 · Mayo 2026*

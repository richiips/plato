# Brief Landing Page Teist v2
> Para Speve → Dev. Última actualización: 2026-05-15

---

## Contexto

El landing actual tiene dos problemas:
1. **Mensaje equivocado** — habla del producto ("carta digital"), no del problema del dueño de restaurante
2. **Línea gráfica incorrecta** — el neobrutalism definido antes es demasiado ruidoso para el perfil boutique. El cliente de Teist valora buen gusto, no actitud

Este brief redefine ambas cosas desde cero.

---

## Principio rector del nuevo landing

> El dueño de restaurante boutique no busca "una carta digital". Busca que su local se vea tan bien en el teléfono como en persona, y entender qué está dejando de ganar.

Cada sección debe responder eso. No hablar de features — hablar de resultados.

---

## Línea gráfica

**Referencia:** Grovia (editorial, confiable, con peso) + Stark (limpio, gradiente suave, mockup flotante)

- **Fondo:** blanco roto o crema muy suave (#FAFAF8) — no blanco puro, no neobrutalism
- **Tipografía:** serif para titulares (elegancia sin ser literal), sans-serif limpia para cuerpo
- **Color acento:** uno solo, oscuro (casi negro o verde muy oscuro) — no naranja, no amarillo neón
- **Mockup:** teléfono real con la splash screen y carta de Teist. Es el hero visual más poderoso que tenemos
- **Espaciado:** generoso. El espacio en blanco es parte del mensaje de calidad
- **Estilo general:** editorial de lujo moderado — no minimalismo frío, no recargado. Como una revista de gastronomía bien diseñada

**Lo que NO va:**
- Box-shadows offset estilo neobrutalism
- Colores llamativos múltiples
- Tipografía display ultra bold al estilo startup tech
- Animaciones distractoras

---

## Estructura de secciones

### 1. Nav
Logo Teist a la izquierda. Links: "Cómo funciona", "Precios", "Ver demo".
CTA derecha: "Solicitar acceso" (botón oscuro, no "empieza gratis").
Sin hamburger en desktop. Sticky al hacer scroll.

---

### 2. Hero
**Objetivo:** que el dueño sienta que esto es para él en menos de 5 segundos.

**Headline (dirección):**
> "Tu restaurante merece una carta a la altura."

Alternativas a testear:
> "La carta más bonita que tus clientes van a fotografiar."
> "La primera impresión también ocurre en la mesa."

**Subheadline:**
> Teist es la carta digital que se ve y se siente como parte de tu marca. No un template — una pieza de diseño. Para restaurantes que se toman en serio cada detalle.

**CTAs:**
- Principal: "Solicitar acceso" → formulario de contacto / WhatsApp
- Secundario: "Ver carta de ejemplo" → abre `/r/the-smash-burger` o demo real en nueva pestaña

**Visual:**
Teléfono con la splash screen de Teist flotando. Si hay dos teléfonos: uno con la splash, otro con la vista de carta (cards de ítems). Fondo crema suave, sin gradientes agresivos.

**Social proof mínimo bajo los CTAs (mientras no hay clientes):**
> Diseñado por Richi Olivares, diseñador con X años trabajando con marcas gastronómicas en Santiago.
*(Reemplazar esto con logos de clientes o quote en cuanto haya el primer caso de estudio)*

---

### 3. El problema (sin título de sección obvio)
**Objetivo:** nombrar la frustración que el dueño ya tiene pero no ha articulado.

Formato: 2-3 párrafos editoriales, o 3 bloques con ícono mínimo. NO lista de bullets genérica.

**Dirección de copy:**
> Tu local tiene identidad. Carta física cuidada, iluminación pensada, vajilla elegida a mano. Pero cuando el cliente saca el teléfono para ver el menú, abre un PDF borroso o un link genérico que parece de otro restaurante.
>
> Gourmedia, OlaClick, Fudo — todos resuelven el problema técnico. Ninguno resuelve el problema de diseño. El restaurante lo configura solo, en un día, y se nota.
>
> Teist es diferente. Richi configura todo por ti. El resultado se ve como parte de tu marca — no como una herramienta que usaste.

---

### 4. Cómo funciona
**Objetivo:** desmitificar. Que el dueño entienda que no tiene que aprender nada.

3 pasos simples, sin jerga técnica:

1. **Nos reunimos** — Richi revisa tu identidad visual, tu carta actual y entiende tu restaurante
2. **Diseñamos juntos** — Configuramos la carta, la splash screen, las fotos y los colores. Tú apruebas
3. **Está listo** — Un QR y tu carta está viva. En tiempo real puedes marcar platos agotados desde tu teléfono

**Visual de apoyo:** screenshots del superadmin o del resultado final en teléfono

---

### 5. Features que importan (beneficios, no features)
**Objetivo:** convencer de que hay sustancia detrás del diseño.

4 bloques, cada uno con resultado de negocio primero, feature técnica segundo:

- **"Tus clientes saben qué ordenar"** — Splash screen inmersiva con tu foto, tu historia, tus redes. El contexto antes de la carta.
- **"Siempre actualizado, en segundos"** — Toggle de disponibilidad en tiempo real. Plato agotado → lo marcas desde el teléfono en 3 segundos.
- **"Sabes qué funciona y qué no"** — Analytics de qué platos se ven más, cuánto tiempo pasan en cada sección, qué ignoran.
- **"Se ve como tú, no como todos"** — 4 temas visuales de diseñador. Serif elegante o tipografía bold. Fondo oscuro o luminoso. Tu acento de color.

---

### 6. Resultado visual (galería / mockups)
**Objetivo:** impacto visual puro. Que se vea tan bien que el dueño quiera eso para su restaurante.

2-3 cartas de ejemplo con temas distintos (noir + blanco + cálido). Teléfonos reales, fondo neutro. Sin texto de acompañamiento — que las imágenes hablen.

**Nota para Dev:** esta sección espera a tener cartas reales de clientes o demos pulidas con el sistema de temas. Por ahora puede ir con un placeholder o solo 1 mockup.

---

### 7. Social proof
**Mientras no hay clientes:** omitir esta sección o reemplazar con una cita del propio Richi sobre la filosofía de diseño. No inventar testimonios.

**En cuanto haya 1 cliente:** quote del dueño del restaurante con foto, nombre del local y resultado concreto ("aumentamos las órdenes de los platos de mayor margen en el primer mes").

---

### 8. Precios
**Objetivo:** que el precio no asuste — que se entienda como inversión.

**Framing del titular:**
> "Un servicio, no una suscripción de software."

**Estructura:**

| | Fundador | Estándar |
|---|---|---|
| **Setup** | $300.000 CLP | $500.000–$1.500.000 CLP |
| **Mensual** | $50.000 CLP | $80.000–$150.000 CLP |
| **Incluye** | Todo lo de Estándar | Diagnóstico de marca · Diseño de carta · Carga de contenido · QR · Diagnóstico 30 días |
| **Disponibilidad** | Solo 3 cupos fundadores | Lista de espera |
| **CTA** | "Quiero ser fundador" | "Solicitar acceso" |

**Nota bajo la tabla:**
> Todos los planes incluyen: configuración completa por Richi, soporte directo vía WhatsApp, actualizaciones de plataforma incluidas.

---

### 9. CTA final
**Titular:**
> "¿Tu restaurante entra en la lista?"

**Subtexto:**
> Teist trabaja con máximo 15–20 restaurantes en Santiago. Cada carta se diseña a mano. Si te interesa, conversamos.

**CTA:** "Escribir a Richi" → abre WhatsApp con mensaje pre-escrito
**CTA secundario:** mail directo (richi@teist.app o similar)

---

### 10. Footer
Logo · Links legales (si aplica) · Instagram de Teist · © 2026 Teist

---

## Lo que NO va en este landing

- "Empieza gratis" o cualquier lenguaje freemium
- Precios en dólares o UF
- "Más de X restaurantes confían en nosotros" (aún no)
- Animaciones de scroll complejas
- Chatbot
- Formulario largo de registro — solo contacto directo (WhatsApp o mail)

---

## Instrucciones para Speve

Validar antes de pasar a Dev:
1. ¿El headline del hero es suficientemente fuerte o necesita otra vuelta?
2. ¿La sección de precios muestra bien el tier fundador sin devaluar el precio normal?
3. ¿La sección "el problema" nombra bien la frustración del dueño boutique o suena a ataque a la competencia?
4. ¿Hay algo que falta o que sobra para el estado actual del producto (pre-primer cliente)?

---

## Instrucciones para Dev

- Stack: Next.js (App Router), Tailwind CSS v4, sin librerías de animación pesadas
- Fuente titular: serif (puede ser la que ya está en el catálogo curado del proyecto)
- Mobile-first obligatorio — el dueño de restaurante va a ver esto desde el teléfono
- La sección de galería de temas (sección 6) puede ir con placeholder hasta tener los temas construidos
- WhatsApp CTA debe abrir `https://wa.me/56XXXXXXXXX?text=Hola+Richi,+me+interesa+Teist` con número real de Richi
- La página reemplaza completamente el landing actual (`app/(public)/page.tsx`)

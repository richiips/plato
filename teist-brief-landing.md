# Teist — Brief Landing Page
### Para Claude Code · Mayo 2026

Reescribir completamente la landing page en `app/(public)/page.tsx`.
La estructura de secciones puede mantenerse, pero el nombre, copy, estilo visual y pricing deben cambiar en su totalidad.

---

## 1. Cambios de marca

| Antes | Después |
|---|---|
| `carta·digital` | `Teist` |
| `hola@carta.digital` | `hola@teist.app` |
| `carta·digital` en footer, nav y meta | `Teist` en todos lados |

El tagline de la marca: **"La carta que merece tu restaurante"**

---

## 2. Estilo visual — Neobrutalism

La landing tiene que verse radicalmente diferente a cualquier SaaS de menús existente. El estilo de referencia es Gumroad, Knowly y el Mailchimp de su época de oro: tipografía display bold, alto contraste, elementos con carácter, sin gradientes genéricos.

### Tipografía
- **Display/headings:** Space Grotesk (700–800 weight) o Syne (700). Importar desde Google Fonts.
- **Body:** Inter o DM Sans (400–500 weight).
- Tamaños grandes y sin miedo — el H1 del hero debe ser masivo.

### Paleta
- Fondo base: `#FAFAF7` (off-white cálido, no blanco puro)
- Negro: `#0A0A0A`
- Acento primario: `#D4F000` (amarillo lima eléctrico) — usado con criterio, no en todo
- Acento secundario: `#FF4D00` (naranja quemado) — para highlights específicos
- Texto secundario: `#6B6B6B`

### Estilo de componentes
- Cards con borde `2px solid #0A0A0A` y sombra offset: `box-shadow: 4px 4px 0px #0A0A0A`
- Botones con borde negro grueso, sin border-radius excesivo (máximo 8px)
- Sin glassmorphism, sin gradientes suaves, sin sombras borrosas
- Elementos que se "salen" de su contenedor en algunos casos (overlap intencional)
- El hero puede tener una grid de fondo sutil (como el actual pero más visible)

---

## 3. Navbar

```
[Teist]                    Cómo funciona  Precios  [Solicitar acceso →]
```

- Logo: "Teist" en Space Grotesk Bold, negro sobre fondo transparente
- CTA navbar: botón con borde negro sólido, fondo amarillo lima (`#D4F000`), texto negro
- Sin backdrop blur excesivo — borde inferior sutil

---

## 4. Hero

### Copy
```
Headline (masivo, 2 líneas máximo):
"Tu restaurante tiene
identidad. Tu carta también."

Subheadline:
"Diseñamos cartas digitales que se ven como extensión real
de tu marca. Con analytics de lo que más pide tu clientela."

CTA primario: "Solicitar acceso →"
CTA secundario: "Ver demo"
```

### Mockup del teléfono
Reemplazar el mockup actual por uno que muestre la **splash screen** de Teist — no la lista de platos. La splash es el diferenciador visual. El mockup debe mostrar:
- Fondo oscuro con foto de restaurant (placeholder)
- Logo centrado (círculo con "T" o placeholder elegante)
- Nombre del restaurante
- Botón "Ver carta" visible
- Sensación: premium, inmersiva

Si es complejo renderizar la splash real, crear un mockup estático que imite ese look.

### Badge sobre el headline
```
● Para restaurantes con criterio
```
Badge con borde negro, fondo amarillo lima, texto negro pequeño.

---

## 5. Sección — Para quién es

Mantener los 3 tipos (fine dining, cafeterías, bares de cóctel).

### Cambios visuales
- Cards con borde negro offset shadow (estilo neobrutalist)
- Ícono en cuadrado negro sólido (no redondeado)
- Quitar los checks verdes — reemplazar con texto directo, sin bullets

### Copy actualizado
```
Headline: "No es para todos."
Subheadline: "Es para quienes ya cuidan cada detalle de su marca."
```

Cards — solo actualizar el tono, hacerlo más directo y menos corporativo.

---

## 6. Sección — Cómo funciona

Mantener los 4 pasos. Cambios:

- Paso 3: "Personaliza el diseño" → "Elegimos juntos el estilo" (refleja el modelo de servicio)
- Estilo visual: números grandes en bold, línea conectora más gruesa y negra

---

## 7. Sección — Demo

Mantener el `DemoSheet`. Cambios de copy:
```
"Abre una carta real"
"Escanea, navega, filtra. Exactamente lo que verá quien
se siente en tu mesa esta noche."
```

---

## 8. Sección — Portfolio

Mantener placeholder. Cambiar copy:
```
Headline: "Cartas que ya están online"
Sub: "Cada una diseñada a medida. Ninguna parece template."
```

---

## 9. Sección — Precios ⚠️ CAMBIO TOTAL

**Eliminar completamente** el pricing actual ($29 USD, "empieza gratis", "sin tarjeta de crédito"). Reemplazar por:

```
Headline: "Inversión, no suscripción genérica."
```

Mostrar dos componentes del precio como cards separadas:

### Card 1 — Setup inicial
```
Diseño a medida
desde $500.000 CLP

Incluye:
· Diseño de carta con tu identidad de marca
· Configuración completa del sistema
· Carga inicial de tu menú
· Onboarding personalizado
```

### Card 2 — Plataforma mensual
```
Plataforma + soporte
desde $80.000 CLP / mes

Incluye:
· Actualizaciones ilimitadas
· Analytics de carta
· QR descargable
· Soporte directo con Richi
```

### Nota de precio fundador
```
"Los primeros 5 restaurantes acceden a precio fundador
a cambio de ser caso de estudio público."
```

### CTA
- Botón principal: "Conversemos →" → abre WhatsApp con mensaje pre-armado
- WhatsApp link: `https://wa.me/56XXXXXXXXX?text=Hola%20Richi%2C%20me%20interesa%20Teist%20para%20mi%20restaurante`
- Botón secundario: link a email `hola@teist.app`

**No poner número de WhatsApp real todavía — usar placeholder `56XXXXXXXXX`**

---

## 10. Footer

```
Teist
La carta que merece tu restaurante.

Links: Inicio | Precios | Demo | Ingresar

© 2026 Teist · teist.app
```

Estilo footer: fondo negro (`#0A0A0A`), texto blanco/gris. Mismo que el actual pero con nombre correcto.

---

## 11. Meta / SEO

```html
<title>Teist — Carta digital para restaurantes boutique</title>
<meta name="description" content="Cartas digitales diseñadas a medida para restaurantes con identidad de marca. Analytics, splash screen inmersiva y actualización en tiempo real." />
```

---

## 12. Lo que NO tocar

- El componente `DemoSheet` — funciona bien, solo cambiar el copy alrededor
- El componente `PortfolioCarousel` — mantener aunque esté vacío
- La estructura de rutas y layouts — no modificar nada fuera de `app/(public)/page.tsx`
- El sistema de auth — no tocar

---

## Resumen de prioridades

1. Nombre Teist en todos lados (navbar, footer, meta)
2. Tipografía Space Grotesk + paleta off-white / negro / amarillo lima
3. Hero con copy nuevo y mockup de splash
4. Pricing completamente reescrito (setup + mensual, sin free trial)
5. Cards con estilo neobrutalist (borde negro + offset shadow)
6. CTA de WhatsApp en pricing

---

*Brief v1.0 · Mayo 2026 · Pasar a Speve para validación antes de ejecutar*

# Teist — Memory
> Archivo dinámico. Actualizar cuando se tomen decisiones importantes, se adquieran clientes o se aprendan cosas nuevas.
> Última actualización: 2026-05-11

---

## Decisiones de producto

- **2026-05-11** — Modelo boutique premium elegido (no SaaS masivo). Razón: mercado genérico saturado, ventaja de Richi está en el diseño.
- **2026-05-11** — Nombre provisional: **Pinta**. Viene de "tiene buena pinta", expresión gastronómica natural.
- **2026-05-11** — Nombre definitivo: **Teist**. Estilización de "taste" (inglés). Dominio: teist.app. Corto, internacional, gastronómico sin ser literal. Pinta descartado.
- **2026-05-11** — 4 temas visuales definidos: `noir`, `blanco`, `calido`, `grafico`. No builder libre — sistemas cerrados con personalización de acento y logo.
- **2026-05-11** — Personalización de temas definida para v1: solo `accent_color` (hex, con validación WCAG AA automática contra el fondo del tema) y `font_id` (selección dentro del catálogo curado de 12 fuentes). Nada más es editable. Fondos, espaciado, jerarquía tipográfica y layout son invariables por tema. Regla: si una variable requiere que Richi revise el resultado para garantizar que se vea bien, no se expone.
- **2026-05-11** — Tokens adicionales en superadmin aprobados para v1, con condiciones. El modelo es "servicio primero": Richi configura desde el superadmin, no el restaurante. Solo 5 tokens adicionales como selects de opciones fijas (no inputs libres): `card_radius` (0/4/12/999px), `card_surface` (transparent/opaque/frosted), `stroke_style` (none/solid/dashed/double), `price_style` (default/badge/subtle/prominent), `section_divider` (none/line/ornamental). Cualquier combinación dentro de estas opciones debe verse bien sin revisión manual. NO incluir: background color libre, box-shadow custom, font-size scale, letter-spacing. Orden de construcción: primero los 4 temas base en carta pública, después los tokens adicionales en superadmin, después la carta pública los consume. Las 3 etapas son secuenciales.
- **2026-05-11** — Splash screen confirmada como feature central y argumento de venta principal.
- **2026-05-11** — Import masivo: CSV/Excel prioritario. PDF via Claude API como v1.5.
- **2026-05-11** — Mini-mesero IA aplazado a v2. No bloquea lanzamiento.
- **2026-05-11** — Pagos/órdenes fuera del scope. Pinta es "la carta más linda e inteligente", no POS.

## Decisiones de negocio

- **2026-05-11** — Pricing definido: setup $500K–$1.5M CLP + mensual $80K–$150K CLP.
- **2026-05-11** — Primeros 3-5 clientes con precio fundador (setup con descuento) a cambio de caso de estudio público con permiso de video y mención.
- **2026-05-11** — Canal principal: programa de referidos con la plataforma del hermano (detección de restaurantes con malas calificaciones). Acuerdo pendiente de conversar.
- **2026-05-11** — Estrategia de adquisición: "servicio primero" — Richi diseña la primera carta de cada cliente, el restaurante no tiene que aprender nada en el onboarding inicial.

## Prioridad de construcción actual

1. ✅ Migraciones SQL (splash columns ya en `/supabase/migrations/`)
2. 🔄 Login / onboarding
3. ⬜ Carta pública `/r/[slug]` con splash screen
4. ⬜ Sistema de temas visuales (tokens CSS por tema)
5. ⬜ Toggle de disponibilidad en tiempo real
6. ⬜ Analytics dashboard
7. ⬜ Landing page de Pinta
8. ⬜ Import masivo CSV/Excel

## Validación con clientes

### Entrevistas realizadas
*(vacío — pendiente)*

### Aprendizajes de entrevistas
*(vacío — pendiente)*

### Pipeline de clientes

| Restaurante | Estado | Contacto | Notas |
|---|---|---|---|
| *(vacío)* | | | |

## Costos operacionales mensuales (estimado)

| Servicio | Plan | Costo USD |
|---|---|---|
| Vercel | Pro | $20 |
| Supabase | Pro | $25 |
| Cloudflare Images | Base | $5 |
| Resend | Free | $0 |
| **Total** | | **~$50** |

Con 20 clientes a $100K CLP/mes → margen de infraestructura ~96%.

## Pivots y cambios de dirección

*(vacío por ahora)*

## Competencia — notas clave

- **Gourmedia** (chilena, 2021): video 360° de platos, modelo gratuito. Superpone en el segmento visual pero apuesta por producción audiovisual cara. No es amenaza directa para el tier de diseño de sistema.
- **OlaClick**: escala masiva pero diseño genérico. El cliente de Teist no es el cliente de OlaClick.
- **Fudo/Toteat**: POS-first, no competencia directa en el segmento de carta premium.

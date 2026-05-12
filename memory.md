# Teist — Memory
> Archivo dinámico. Actualizar cuando se tomen decisiones importantes, se adquieran clientes o se aprendan cosas nuevas.
> Última actualización: 2026-05-12

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
- **2026-05-11** — Pagos/órdenes fuera del scope. Teist es "la carta más linda e inteligente", no POS.

## Decisiones de negocio

- **2026-05-11** — Pricing definido: setup $500K–$1.5M CLP + mensual $80K–$150K CLP.
- **2026-05-11** — Primeros 3-5 clientes con precio fundador (setup con descuento) a cambio de caso de estudio público con permiso de video y mención.
- **2026-05-12** — Precio fundador definitivo: setup $180K CLP + mensual $49K CLP, a cambio de caso de estudio público con video y mención. Candidatos iniciales: 2 ex-clientes de Mesero que migraron a Toteat — contactar solo cuando haya un demo tangible que justifique el cambio (mínimo un tema visual al 100% de calidad).
- **2026-05-11** — Estrategia de adquisición: "servicio primero" — Richi diseña la primera carta de cada cliente, el restaurante no tiene que aprender nada en el onboarding inicial.
- **2026-05-12** — Desglose oficial del setup ($500K–$1.5M CLP). El setup son honorarios de diseño + implementación + consultoría inicial, NO una licencia técnica. Incluye: (1) diagnóstico de marca (identidad visual, posicionamiento, elección de tema); (2) diseño de carta (estructura, secciones, orden, qué destacar); (3) configuración visual (acento, fuente, logo, splash screen); (4) carga de contenido (platos, descripciones, precios, fotos); (5) QR listo para imprimir; (6) diagnóstico de primeros 30 días de analytics con informe entregado. El restaurante no toca nada — Richi lo deja funcionando. Esto lo diferencia radicalmente del modelo self-service de Gourmedia.

## Prioridad de construcción actual

1. ✅ Migraciones SQL (splash columns ya en `/supabase/migrations/`)
2. 🔄 Login / onboarding
3. ✅ Carta pública `/r/[slug]` con splash screen
4. 🔄 Sistema de temas visuales (tokens CSS por tema) — noir implementado al 100%, blanco/calido/grafico pendientes
5. ⬜ Toggle de disponibilidad en tiempo real
6. ⬜ Analytics dashboard
7. ⬜ Landing page de Teist
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
| Cloudflare R2 | Free tier | $0 |
| Resend | Free | $0 |
| **Total** | | **~$50** |

Con 20 clientes a $100K CLP/mes → margen de infraestructura ~96%.

## Pivots y cambios de dirección

*(vacío por ahora)*

## Competencia — notas clave

- **Gourmedia** (chilena, 2021) — COMPETENCIA REAL, más seria de lo que se pensaba inicialmente. Suite completa: menú digital (best seller), loyalty passes, reservas. 500+ marcas mundiales. Clientes en Chile incluyen: Ambrosía, Osaka, InterContinental, Novotel, Pullman, Hilton, Marriott, Kunstmann, La Mar, entre otros.
  - Pricing menú digital: Light $23K CLP/mes · Standard $40K CLP/mes · Black precio a convenir
  - Features que ya tienen: diseño personalizado, analytics, real-time, AI translation, videos, toggle disponibilidad, recomendaciones, maridajes, pop-ups, captación de datos, precios dinámicos
  - Modelo: self-service ("1 día y estás operando") — el restaurante lo configura solo
  - Posicionamiento: "arma de ventas", optimización de ticket y fidelización — NO diseño de marca
  - **Gap real:** no tienen splash screen inmersiva. El diseño es funcional, no hermoso (ver Uncle Fletch). Resultado de self-service = limitado por lo que el restaurante sabe configurar.
  - **Implicación para Teist:** la diferencia visual tiene que ser obvia en 3 segundos. No "un poco mejor" — otra liga. El argumento de venta es diseño-como-servicio vs. herramienta-que-configuras-tú-mismo.
  - **Ambrosía ya es cliente de Gourmedia** — no prospectar hasta tener casos de éxito propios.
- **OlaClick**: escala masiva pero diseño genérico. El cliente de Teist no es el cliente de OlaClick.
- **Fudo/Toteat**: POS-first, no competencia directa en el segmento de carta premium.

## Aprendizajes estratégicos

- **2026-05-12** — Gourmedia es competencia directa real en el segmento boutique. La decisión es continuar, pero con barra visual más alta. Teist no puede competir en features ni precio — compite en craft y servicio.
- **2026-05-12** — El pricing de $80-150K CLP/mes requiere justificación visual brutal frente a los $40K de Gourmedia Standard. Sin esa diferencia obvia, la venta es difícil.
- **2026-05-12** — El modelo "servicio primero" (Richi configura todo) es el diferenciador operacional clave frente a Gourmedia self-service. Mantenerlo como principio central.
- **2026-05-12** — Pregunta de validación clave para entrevistas: ¿están usando Gourmedia? ¿Qué sienten que falta? Eso abre la conversación de diseño vs. herramienta.
- **2026-05-12** — El pitch tiene que hablar el idioma del dueño del restaurante: ROI y número, no "carta bonita". Frame correcto: "un plato visible que no se vende te está costando X por mes — Teist te dice cuáles son y por qué."
- **2026-05-12** — El setup de $500K-$1.5M debe incluir explícitamente un diagnóstico inicial de menú (Richi revisa primeros 30 días de datos y entrega informe). Convierte el costo en consultoría de negocio, no servicios técnicos.
- **2026-05-12** — Modelo de exclusividad activa como posicionamiento: "15-20 restaurantes en Santiago, lista de espera." Refuerza el precio alto y hace que cada cliente sienta que fue seleccionado. No requiere construir nada — solo cambiar el lenguaje.
- **2026-05-12** — La carta como canal de marketing: el segmento boutique fotografía y comparte cartas. Una carta de Teist es contenido orgánico. Gourmedia no hace este argumento.

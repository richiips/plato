@AGENTS.md

# Pinta — Contexto del Proyecto

## Qué es Pinta
Pinta es una plataforma de carta digital para restaurantes boutique. El diferenciador no es el QR — es el diseño. Cada carta se ve como extensión real de la identidad del restaurante, no un template genérico. Incluye analytics de visualizaciones por plato y sistema de temas visuales.

**Nombre en código del proyecto:** plato-app
**Estado actual:** MVP en construcción, pre-lanzamiento

## A quién le vendemos
Restaurantes boutique en Santiago con identidad visual cuidada. Ejemplos del perfil ideal: Boragó, 040, Ambrosía, Karai, cafeterías de tercera ola (Wonderland, Café Forastero), bares de cóctel de autor (Siete Negronis, Chipe Libre). NO es para restaurantes de menú del día ni cadenas.

## Modelo de negocio
- **Setup inicial:** $500.000 – $1.500.000 CLP por restaurante (diseño a medida + configuración + onboarding)
- **Mensual de plataforma:** $80.000 – $150.000 CLP según features
- **Primeros 3-5 clientes:** precio fundador con descuento a cambio de caso de estudio público

## Diferenciadores clave
1. Diseño que representa la marca real del restaurante (4 temas visuales con tokens CSS)
2. Splash screen inmersiva antes de la carta (video/foto + logo + info + redes)
3. Analytics de carta: qué platos se ven más, sesiones, tiempo por sección
4. Toggle de disponibilidad en tiempo real (marcar plato agotado en segundos)
5. Import masivo via CSV/Excel (y futuro PDF via Claude API)

## Los 4 temas visuales
- `noir` — fine dining, fondo oscuro, tipografía serif, elegante
- `blanco` — cafetería de especialidad, limpio, minimalista, mucho espacio
- `calido` — bistró/cocina local, tonos warm, acogedor, artesanal
- `grafico` — bar de cóctel/concepto urbano, bold, tipografía display, atrevido

## Stack técnico
- Next.js 16 (App Router) + React 19 + TypeScript strict
- Supabase (PostgreSQL + Auth + Row Level Security)
- Tailwind CSS v4 + shadcn/ui + dnd-kit
- Cloudflare Images (direct upload, CDN global)
- Vercel (hosting)

## Competencia
- **Fudo** — POS todo-en-uno, 30.000+ negocios, fuerte en Chile/Arg/Méx. No es competencia directa.
- **Toteat** — POS + QR integrado, fuerte en Chile. Orientado a operaciones, no diseño.
- **OlaClick** — Freemium, 120.000+ negocios en LATAM. Genérico, sin diseño.
- **Gourmedia** — Startup chilena (2021), video 360° de platos, modelo gratuito. Se superpone parcialmente.
- El gap real: nadie hace cartas verdaderamente hermosas para el segmento boutique.

## Canal de distribución clave
El hermano de Richi está construyendo una plataforma que detecta restaurantes con malas calificaciones y les da recomendaciones de mejora. Ese flujo alimenta leads calientes para Pinta (programa de referidos, no integración técnica).

## Quién construye esto
**Richi Olivares** — product designer, no developer. Usa Claude Code para construir el producto. Primera versión de Mesero (producto anterior similar) lanzada en 2017, cerrada en 2026 por falta de clientes y organización. Pinta es el relanzamiento con foco claro.

---

## Instrucciones para cada sesión

1. **Al iniciar:** Lee `memory.md` en la raíz del proyecto. Contiene decisiones tomadas, clientes, aprendizajes y cambios de dirección. Es tu contexto dinámico.

2. **Al cerrar o cuando se tome una decisión importante:** Actualiza `memory.md` con lo nuevo. Decisiones de producto, cambios de estrategia, clientes adquiridos, aprendizajes de entrevistas — todo va ahí.

3. **Prioridad de construcción:**
   - SQL migrations reales → Login/onboarding → Carta pública `/r/[slug]` con splash → Personalización de marca (temas) → Toggle disponibilidad → Analytics dashboard → Landing page
   - NO construir aún: mini-mesero IA, integración de pagos/órdenes, tests E2E, Resend

4. **Principio de diseño:** Cada decisión visual debe poder justificarse frente a un restaurante boutique que ya gastó $1M CLP en su identidad de marca. Si no pasa ese filtro, no va.

---

## Sistema de agentes

Este proyecto tiene dos agentes especializados en `.claude/agents/`:

### Speve (`speve.md`) — Advisor de negocio y producto
Consultar a Speve **antes** de construir cualquier feature significativa. Él valida la prioridad, define el scope exacto, y decide qué NO tocar en cada iteración. Si una tarea no pasó por Speve, no construyas.

### Dev (`dev.md`) — Ejecutor técnico
Construye lo que Speve aprobó. Conoce el codebase, los patrones del proyecto y el stack. Solo ejecuta — no decide qué construir.

**La cadena es siempre: Speve → Dev.** Nunca al revés.

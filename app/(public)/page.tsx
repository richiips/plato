import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check, TrendingUp, TrendingDown, Minus } from "lucide-react";

export const metadata: Metadata = {
  title: "Teist — Carta digital para restaurantes boutique",
  description:
    "La carta digital que se ve como tu marca y te muestra qué platos generan más ventas. Diseño a medida para restaurantes boutique en Santiago.",
};

const WA_LINK =
  "https://wa.me/56XXXXXXXXX?text=Hola%20Richi%2C%20me%20interesa%20Teist%20para%20mi%20restaurante";
const WA_FOUNDER =
  "https://wa.me/56XXXXXXXXX?text=Hola%20Richi%2C%20quiero%20ser%20cliente%20fundador%20de%20Teist";

/* ─── Navbar ─────────────────────────────────────────────── */
function Navbar() {
  return (
    <header
      className="fixed inset-x-0 top-0 z-50"
      style={{
        backgroundColor: "rgba(250,250,248,0.90)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(28,27,25,0.06)",
      }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <span
          className="text-xl font-semibold tracking-tight"
          style={{ fontFamily: "var(--font-playfair)", color: "#1C1B19" }}
        >
          Teist
        </span>

        <nav className="hidden items-center gap-7 sm:flex">
          {[
            { label: "Cómo funciona", href: "#como-funciona" },
            { label: "Precios", href: "#precios" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-sm transition-opacity hover:opacity-100"
              style={{ fontFamily: "var(--font-inter)", color: "#5C5B58" }}
            >
              {label}
            </Link>
          ))}
          <a
            href="/r/demo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm transition-opacity hover:opacity-100"
            style={{ fontFamily: "var(--font-inter)", color: "#5C5B58" }}
          >
            Ver demo
          </a>
          <Link
            href="/login"
            className="text-sm transition-opacity hover:opacity-100"
            style={{ fontFamily: "var(--font-inter)", color: "#5C5B58" }}
          >
            Ingresar
          </Link>
        </nav>

        <a
          href={WA_LINK}
          className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-80"
          style={{ fontFamily: "var(--font-inter)", backgroundColor: "#1C1B19", color: "#F5F0E8" }}
        >
          Solicitar acceso
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </header>
  );
}

/* ─── Phone Mockup ───────────────────────────────────────── */
function PhoneMockup({ size = 300 }: { size?: number }) {
  return (
    <div className="relative mx-auto select-none" style={{ width: size }}>
      <div
        className="overflow-hidden"
        style={{
          borderRadius: size * 0.17,
          backgroundColor: "#0A0908",
          padding: "9px 9px 5px",
          boxShadow:
            "0 50px 100px rgba(0,0,0,0.22), 0 20px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)",
        }}
      >
        <div
          className="mx-auto mb-1.5"
          style={{
            width: size * 0.3,
            height: size * 0.055,
            backgroundColor: "#0A0908",
            borderRadius: "0 0 10px 10px",
          }}
        />

        <div
          className="relative flex flex-col items-center justify-center gap-4 overflow-hidden text-center"
          style={{
            backgroundColor: "#0E0D0B",
            borderRadius: size * 0.14,
            minHeight: size * 1.55,
            padding: "28px 20px",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 20%, rgba(255,255,255,0.05) 0%, transparent 60%)",
            }}
          />

          <div
            className="flex items-center justify-center rounded-full"
            style={{
              width: size * 0.23,
              height: size * 0.23,
              border: "1.5px solid rgba(255,255,255,0.12)",
              backgroundColor: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.85)",
              fontSize: size * 0.08,
              fontFamily: "var(--font-playfair)",
              fontWeight: 500,
            }}
          >
            B
          </div>

          <div>
            <p
              style={{
                color: "rgba(255,255,255,0.9)",
                fontSize: size * 0.055,
                fontFamily: "var(--font-playfair)",
                fontWeight: 500,
              }}
            >
              Boragó
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: size * 0.038,
                fontFamily: "var(--font-inter)",
                marginTop: 5,
                letterSpacing: "0.04em",
              }}
            >
              Cocina de raíces chilenas
            </p>
          </div>

          <div style={{ width: 32, height: 1, backgroundColor: "rgba(255,255,255,0.08)" }} />

          <div
            style={{
              display: "flex",
              gap: 10,
              fontSize: size * 0.036,
              color: "rgba(255,255,255,0.3)",
              fontFamily: "var(--font-inter)",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            <span>Vitacura</span>
            <span>·</span>
            <span>Mar — Dom</span>
          </div>

          <div
            style={{
              marginTop: 8,
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 999,
              padding: `${size * 0.028}px ${size * 0.08}px`,
              color: "rgba(255,255,255,0.7)",
              fontSize: size * 0.042,
              fontFamily: "var(--font-inter)",
              backgroundColor: "rgba(255,255,255,0.04)",
            }}
          >
            Ver carta
          </div>
        </div>

        <div
          className="mx-auto my-2"
          style={{ width: size * 0.22, height: 4, backgroundColor: "#2A2A28", borderRadius: 999 }}
        />
      </div>
    </div>
  );
}

/* ─── Hero ───────────────────────────────────────────────── */
function HeroSection() {
  return (
    <section
      className="relative overflow-hidden pb-0 pt-28 sm:pt-36"
      style={{
        background:
          "linear-gradient(170deg, #E8DFC8 0%, #EFE8D5 20%, #F5F0E4 45%, #F9F6F0 65%, #FAFAF8 85%)",
      }}
    >
      <div
        className="pointer-events-none absolute -right-48 -top-48 h-175 w-175 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(210,195,155,0.25)" }}
      />
      <div
        className="pointer-events-none absolute -left-32 top-1/3 h-125 w-125 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(190,210,185,0.15)" }}
      />

      <div className="relative mx-auto max-w-3xl px-5 text-center">
        <div
          className="mb-7 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium"
          style={{
            fontFamily: "var(--font-inter)",
            backgroundColor: "rgba(28,27,25,0.04)",
            color: "#5C5B58",
            borderColor: "rgba(28,27,25,0.1)",
          }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "#3D7A45" }} />
          Solo 20 restaurantes en Santiago · Cupos disponibles
        </div>

        <h1
          className="text-5xl leading-[1.04] tracking-tight sm:text-6xl lg:text-[5.5rem]"
          style={{ fontFamily: "var(--font-inter)", fontWeight: 800, color: "#1C1B19" }}
        >
          La carta más bonita que tus clientes van a fotografiar.
        </h1>

        <p
          className="mx-auto mt-6 max-w-xl text-lg leading-relaxed"
          style={{ fontFamily: "var(--font-inter)", color: "#5C5B58" }}
        >
          Teist diseña cartas digitales que se ven como tu marca y te muestran qué
          platos mueven más tu caja. Richi lo configura todo — el restaurante no
          aprende nada.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a
            href={WA_LINK}
            className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold transition-opacity hover:opacity-80"
            style={{
              fontFamily: "var(--font-inter)",
              backgroundColor: "#1C1B19",
              color: "#F5F0E8",
              boxShadow: "0 8px 24px rgba(28,27,25,0.25)",
            }}
          >
            Solicitar acceso
            <ArrowUpRight className="h-4 w-4" />
          </a>
          <a
            href="/r/demo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border px-8 py-4 text-sm font-medium transition-colors hover:bg-black/5"
            style={{
              fontFamily: "var(--font-inter)",
              borderColor: "rgba(28,27,25,0.18)",
              color: "#1C1B19",
            }}
          >
            Ver carta de ejemplo
          </a>
        </div>
      </div>

      {/* Phone + floating cards */}
      <div className="relative mx-auto mt-16" style={{ maxWidth: 700 }}>
        {/* Analytics floating card */}
        <div
          className="absolute left-4 top-20 z-10 hidden rounded-2xl p-4 lg:block"
          style={{
            width: 175,
            backgroundColor: "#fff",
            border: "1px solid rgba(28,27,25,0.07)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          }}
        >
          <p
            className="text-[9px] font-semibold uppercase tracking-widest"
            style={{ fontFamily: "var(--font-inter)", color: "#5C5B58" }}
          >
            Top plato hoy
          </p>
          <p
            className="mt-1 text-sm font-bold"
            style={{ fontFamily: "var(--font-inter)", color: "#1C1B19" }}
          >
            Pisco Sour
          </p>
          <div className="mt-2 flex items-end gap-0.5" style={{ height: 32 }}>
            {[38, 52, 44, 65, 58, 82, 100].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm"
                style={{
                  height: `${h}%`,
                  backgroundColor: i === 6 ? "#1C1B19" : "rgba(28,27,25,0.1)",
                }}
              />
            ))}
          </div>
          <p
            className="mt-2 text-xs font-bold"
            style={{ fontFamily: "var(--font-inter)", color: "#1C1B19" }}
          >
            89 vistas
            <span className="ml-1 font-normal" style={{ color: "#3D7A45" }}>
              ↑ 12%
            </span>
          </p>
        </div>

        {/* Availability floating card */}
        <div
          className="absolute right-4 top-28 z-10 hidden rounded-2xl p-4 lg:block"
          style={{
            width: 175,
            backgroundColor: "#fff",
            border: "1px solid rgba(28,27,25,0.07)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          }}
        >
          <p
            className="mb-3 text-[9px] font-semibold uppercase tracking-widest"
            style={{ fontFamily: "var(--font-inter)", color: "#5C5B58" }}
          >
            Disponibilidad
          </p>
          {[
            { name: "Lomo saltado", on: true },
            { name: "Ceviche mixto", on: true },
            { name: "Pisco Sour", on: false },
          ].map(({ name, on }) => (
            <div key={name} className="mb-2 flex items-center justify-between gap-2">
              <span
                className="text-xs"
                style={{ fontFamily: "var(--font-inter)", color: on ? "#1C1B19" : "#AAA8A4" }}
              >
                {name}
              </span>
              <div
                className="relative shrink-0"
                style={{
                  width: 28,
                  height: 16,
                  borderRadius: 999,
                  backgroundColor: on ? "#1C1B19" : "rgba(28,27,25,0.15)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 2,
                    left: on ? "auto" : 2,
                    right: on ? 2 : "auto",
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: "#fff",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center px-5">
          <PhoneMockup size={310} />
        </div>
      </div>

      <div
        className="pointer-events-none h-24"
        style={{
          background: "linear-gradient(to bottom, transparent, #ffffff)",
          marginTop: -24,
        }}
      />
    </section>
  );
}

/* ─── Analytics Mockup ───────────────────────────────────── */
function AnalyticsMockup() {
  const bars = [
    { day: "L", v: 42 },
    { day: "M", v: 68 },
    { day: "M", v: 55 },
    { day: "J", v: 85 },
    { day: "V", v: 72 },
    { day: "S", v: 100 },
    { day: "D", v: 60 },
  ];
  const rows = [
    { name: "Pisco Sour", v: 89, dir: "up" },
    { name: "Lomo saltado", v: 67, dir: "up" },
    { name: "Ceviche mixto", v: 45, dir: "flat" },
    { name: "Tiramisú", v: 23, dir: "down" },
  ];
  return (
    <div
      className="rounded-2xl p-6"
      style={{
        backgroundColor: "#fff",
        boxShadow: "0 24px 56px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.06)",
      }}
    >
      <p
        className="text-[10px] font-semibold uppercase tracking-widest"
        style={{ fontFamily: "var(--font-inter)", color: "#5C5B58" }}
      >
        Vistas esta semana
      </p>
      <p
        className="mt-1 text-2xl font-bold"
        style={{ fontFamily: "var(--font-inter)", color: "#1C1B19" }}
      >
        323 interacciones
      </p>

      <div className="mt-5 flex items-end gap-1.5" style={{ height: 72 }}>
        {bars.map(({ day, v }, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
            <div
              className="w-full rounded-sm"
              style={{
                height: `${v}%`,
                backgroundColor: v === 100 ? "#1C1B19" : "rgba(28,27,25,0.1)",
              }}
            />
            <span
              className="text-[9px] font-medium"
              style={{ fontFamily: "var(--font-inter)", color: "#AAA8A4" }}
            >
              {day}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {rows.map(({ name, v, dir }) => (
          <div key={name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor:
                    dir === "up" ? "#3D7A45" : dir === "down" ? "#B94040" : "#AAA8A4",
                }}
              />
              <span
                className="text-sm"
                style={{ fontFamily: "var(--font-inter)", color: "#1C1B19" }}
              >
                {name}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="text-sm font-semibold tabular-nums"
                style={{ fontFamily: "var(--font-inter)", color: "#1C1B19" }}
              >
                {v}
              </span>
              {dir === "up" && <TrendingUp className="h-3.5 w-3.5" style={{ color: "#3D7A45" }} />}
              {dir === "down" && (
                <TrendingDown className="h-3.5 w-3.5" style={{ color: "#B94040" }} />
              )}
              {dir === "flat" && <Minus className="h-3.5 w-3.5" style={{ color: "#AAA8A4" }} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Availability Mockup ────────────────────────────────── */
function AvailabilityMockup() {
  const items = [
    { name: "Lomo saltado", price: "$12.500", on: true },
    { name: "Ceviche mixto", price: "$14.000", on: true },
    { name: "Pisco Sour", price: "$8.500", on: false },
    { name: "Tiramisú", price: "$6.000", on: true },
  ];
  return (
    <div
      className="rounded-2xl p-6"
      style={{
        backgroundColor: "#fff",
        boxShadow: "0 24px 56px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.06)",
      }}
    >
      <p
        className="mb-1 text-[10px] font-semibold uppercase tracking-widest"
        style={{ fontFamily: "var(--font-inter)", color: "#5C5B58" }}
      >
        Disponibilidad en tiempo real
      </p>
      <p className="mb-5 text-xs" style={{ fontFamily: "var(--font-inter)", color: "#AAA8A4" }}>
        Actualiza desde tu teléfono en 3 seg.
      </p>
      <div className="space-y-2.5">
        {items.map(({ name, price, on }) => (
          <div
            key={name}
            className="flex items-center justify-between rounded-xl px-4 py-3"
            style={{
              backgroundColor: on ? "#FAFAF8" : "rgba(28,27,25,0.03)",
              border: "1px solid rgba(28,27,25,0.06)",
              opacity: on ? 1 : 0.55,
            }}
          >
            <div>
              <p
                className="text-sm font-semibold"
                style={{ fontFamily: "var(--font-inter)", color: "#1C1B19" }}
              >
                {name}
              </p>
              <p className="text-xs" style={{ fontFamily: "var(--font-inter)", color: "#5C5B58" }}>
                {price}
              </p>
            </div>
            <div
              className="relative shrink-0"
              style={{
                width: 36,
                height: 20,
                borderRadius: 999,
                backgroundColor: on ? "#1C1B19" : "rgba(28,27,25,0.18)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 2,
                  left: on ? "auto" : 2,
                  right: on ? 2 : "auto",
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  backgroundColor: "#fff",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Problema ───────────────────────────────────────────── */
function ProblemSection() {
  return (
    <section className="py-20 sm:py-28" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-20">
          <div className="pt-1">
            <p
              className="text-[10px] font-semibold uppercase tracking-widest"
              style={{ fontFamily: "var(--font-inter)", color: "#5C5B58" }}
            >
              El problema
            </p>
          </div>
          <div>
            <h2
              className="text-3xl font-bold leading-tight sm:text-4xl"
              style={{ fontFamily: "var(--font-inter)", color: "#1C1B19" }}
            >
              Tu local tiene identidad. Tu carta digital, no.
            </h2>
            <div
              className="mt-6 space-y-5 text-base leading-relaxed"
              style={{ fontFamily: "var(--font-inter)", color: "#5C5B58" }}
            >
              <p>
                Vajilla elegida a mano, iluminación pensada, una experiencia construida
                durante años. Pero cuando el cliente saca el teléfono para ver el menú,
                abre un PDF borroso o un link que parece de otro restaurante.
              </p>
              <p>
                Hay plataformas que resuelven el problema técnico. Tú la configuras solo,
                en un día, y se nota. El resultado parece una herramienta — porque lo es.
              </p>
              <p>
                Teist es diferente. Richi configura todo por ti. El resultado se ve como
                parte de tu marca, no como una herramienta que usaste.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Cómo funciona ──────────────────────────────────────── */
function HowItWorksSection() {
  const steps = [
    {
      n: "01",
      title: "Nos reunimos",
      desc: "Richi revisa tu identidad visual y tu carta actual. Entiende qué hace única tu experiencia. Sin formularios — una conversación.",
    },
    {
      n: "02",
      title: "Diseñamos juntos",
      desc: "Configuramos la carta, la splash screen, las fotos y los colores. Tú apruebas cada detalle. El restaurante no toca nada técnico.",
    },
    {
      n: "03",
      title: "QR en la mesa",
      desc: "Tu carta está viva desde el primer día. Marcas platos agotados en segundos. A los 30 días, Richi te entrega el primer informe de analytics.",
    },
  ];

  return (
    <section id="como-funciona" className="py-20 sm:py-28" style={{ backgroundColor: "#F7F6F4" }}>
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-14">
          <p
            className="mb-3 text-[10px] font-semibold uppercase tracking-widest"
            style={{ fontFamily: "var(--font-inter)", color: "#5C5B58" }}
          >
            El proceso
          </p>
          <h2
            className="text-3xl font-bold sm:text-4xl"
            style={{ fontFamily: "var(--font-inter)", color: "#1C1B19" }}
          >
            Tres pasos. El restaurante no aprende nada.
          </h2>
        </div>

        <div className="grid gap-10 sm:grid-cols-3">
          {steps.map(({ n, title, desc }) => (
            <div key={n}>
              <span
                className="mb-4 block text-6xl font-black leading-none"
                style={{ fontFamily: "var(--font-inter)", color: "rgba(28,27,25,0.07)" }}
              >
                {n}
              </span>
              <h3
                className="mb-2 text-base font-bold"
                style={{ fontFamily: "var(--font-inter)", color: "#1C1B19" }}
              >
                {title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ fontFamily: "var(--font-inter)", color: "#5C5B58" }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Feature: Analytics ─────────────────────────────────── */
function FeatureAnalytics() {
  return (
    <section className="py-20 sm:py-28" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Text */}
          <div>
            <p
              className="mb-4 text-[10px] font-semibold uppercase tracking-widest"
              style={{ fontFamily: "var(--font-inter)", color: "#5C5B58" }}
            >
              Inteligencia de menú
            </p>
            <h2
              className="text-4xl font-bold leading-tight sm:text-5xl"
              style={{ fontFamily: "var(--font-inter)", color: "#1C1B19" }}
            >
              Sabes qué platos mueven tu caja.
            </h2>
            <p
              className="mt-5 text-base leading-relaxed"
              style={{ fontFamily: "var(--font-inter)", color: "#5C5B58" }}
            >
              <strong style={{ fontWeight: 600, color: "#1C1B19" }}>
                Analytics de qué platos generan más interés,
              </strong>{" "}
              cuánto tiempo pasan tus clientes en cada sección y qué ignoran. Después de
              30 días, Richi te entrega un informe con recomendaciones concretas para
              ordenar mejor tu menú y vender más de lo que más te conviene.
            </p>
            <div className="mt-6 space-y-3">
              {[
                "Vistas por plato, por día y por sección",
                "Tiempo promedio de sesión en tu carta",
                "Informe de 30 días entregado por Richi",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: "#1C1B19" }}
                  >
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span
                    className="text-sm"
                    style={{ fontFamily: "var(--font-inter)", color: "#1C1B19" }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
            <a
              href={WA_LINK}
              className="mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ fontFamily: "var(--font-inter)", backgroundColor: "#1C1B19", color: "#F5F0E8" }}
            >
              Solicitar acceso
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Vistas en tiempo real", "Por sección", "Informe mensual"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border px-3 py-1 text-xs font-medium"
                  style={{
                    fontFamily: "var(--font-inter)",
                    borderColor: "rgba(28,27,25,0.15)",
                    color: "#5C5B58",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Mockup in colored card */}
          <div
            className="rounded-3xl p-7 sm:p-10"
            style={{
              background: "linear-gradient(145deg, #CBD4E1 0%, #E6E0D4 100%)",
            }}
          >
            <AnalyticsMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Feature: Toggle ────────────────────────────────────── */
function FeatureAvailability() {
  return (
    <section className="py-20 sm:py-28" style={{ backgroundColor: "#F7F6F4" }}>
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Mockup in colored card */}
          <div
            className="order-2 rounded-3xl p-7 sm:p-10 lg:order-1"
            style={{
              background: "linear-gradient(145deg, #DDD6CA 0%, #C9D3DD 100%)",
            }}
          >
            <AvailabilityMockup />
          </div>

          {/* Text */}
          <div className="order-1 lg:order-2">
            <p
              className="mb-4 text-[10px] font-semibold uppercase tracking-widest"
              style={{ fontFamily: "var(--font-inter)", color: "#5C5B58" }}
            >
              Operación en segundos
            </p>
            <h2
              className="text-4xl font-bold leading-tight sm:text-5xl"
              style={{ fontFamily: "var(--font-inter)", color: "#1C1B19" }}
            >
              Nunca vendas un plato que no tienes.
            </h2>
            <p
              className="mt-5 text-base leading-relaxed"
              style={{ fontFamily: "var(--font-inter)", color: "#5C5B58" }}
            >
              <strong style={{ fontWeight: 600, color: "#1C1B19" }}>
                Marca un plato agotado desde tu teléfono en 3 segundos.
              </strong>{" "}
              Sin llamar a nadie, sin actualizar un PDF. Desde la cocina, durante el servicio.
            </p>
            <div className="mt-6 space-y-3">
              {[
                "Toggle de disponibilidad en tiempo real",
                "Actualización instantánea para todos los clientes",
                "Sin apps que instalar ni capacitación",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: "#1C1B19" }}
                  >
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span
                    className="text-sm"
                    style={{ fontFamily: "var(--font-inter)", color: "#1C1B19" }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
            <a
              href={WA_LINK}
              className="mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ fontFamily: "var(--font-inter)", backgroundColor: "#1C1B19", color: "#F5F0E8" }}
            >
              Solicitar acceso
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Tiempo real", "Sin instalación", "Desde el celular"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border px-3 py-1 text-xs font-medium"
                  style={{
                    fontFamily: "var(--font-inter)",
                    borderColor: "rgba(28,27,25,0.15)",
                    color: "#5C5B58",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Feature: Splash + Identity ─────────────────────────── */
function FeatureSplashIdentity() {
  return (
    <section className="py-20 sm:py-28" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Splash */}
          <div className="rounded-3xl p-8" style={{ backgroundColor: "#0E0D0B" }}>
            <p
              className="mb-2 text-[10px] font-semibold uppercase tracking-widest"
              style={{ fontFamily: "var(--font-inter)", color: "rgba(255,255,255,0.3)" }}
            >
              Splash screen
            </p>
            <h3
              className="mb-3 text-xl font-bold leading-tight"
              style={{ fontFamily: "var(--font-inter)", color: "rgba(255,255,255,0.9)" }}
            >
              Tu historia, antes de que ordenen.
            </h3>
            <p
              className="mb-8 text-sm leading-relaxed"
              style={{ fontFamily: "var(--font-inter)", color: "rgba(255,255,255,0.4)" }}
            >
              Una pantalla inmersiva con tu foto, tu historia y tus redes. El contexto
              que hace que el cliente quiera quedarse.
            </p>
            <div className="flex justify-center">
              <PhoneMockup size={180} />
            </div>
          </div>

          {/* Identity */}
          <div
            className="rounded-3xl p-8"
            style={{ backgroundColor: "#F7F6F4", border: "1px solid rgba(28,27,25,0.06)" }}
          >
            <p
              className="mb-2 text-[10px] font-semibold uppercase tracking-widest"
              style={{ fontFamily: "var(--font-inter)", color: "#5C5B58" }}
            >
              Identidad visual
            </p>
            <h3
              className="mb-3 text-xl font-bold leading-tight"
              style={{ fontFamily: "var(--font-inter)", color: "#1C1B19" }}
            >
              Tu marca, no la de todos.
            </h3>
            <p
              className="mb-8 text-sm leading-relaxed"
              style={{ fontFamily: "var(--font-inter)", color: "#5C5B58" }}
            >
              4 sistemas visuales de diseñador: noir, blanco, cálido y gráfico.
              Tu color de acento, tu fuente, tu logo. Ninguna carta de Teist se parece a otra.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "Noir", bg: "#0E0D0B", fg: "rgba(255,255,255,0.85)", desc: "Fine dining" },
                { name: "Blanco", bg: "#FFFFFF", fg: "#1C1B19", desc: "Cafetería" },
                { name: "Cálido", bg: "#F5ECD7", fg: "#2A1F0E", desc: "Bistró" },
                { name: "Gráfico", bg: "#1C1B19", fg: "#D4F000", desc: "Cóctel bar" },
              ].map(({ name, bg, fg, desc }) => (
                <div
                  key={name}
                  className="rounded-xl px-4 py-3"
                  style={{ backgroundColor: bg, border: "1px solid rgba(28,27,25,0.08)" }}
                >
                  <p
                    className="text-sm font-bold"
                    style={{ fontFamily: "var(--font-inter)", color: fg }}
                  >
                    {name}
                  </p>
                  <p
                    className="text-[10px]"
                    style={{ fontFamily: "var(--font-inter)", color: fg, opacity: 0.5, marginTop: 2 }}
                  >
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Pricing ────────────────────────────────────────────── */
function PricingSection() {
  const included = [
    {
      title: "Diagnóstico de marca",
      desc: "Revisamos tu identidad visual, posicionamiento y elegimos el tema que mejor representa tu restaurante.",
    },
    {
      title: "Diseño de carta",
      desc: "Estructura, secciones, orden y qué platos destacar para que el cliente encuentre lo que más te conviene vender.",
    },
    {
      title: "Configuración visual",
      desc: "Tu color de acento, tu fuente, tu logo y tu splash screen. Cero templates.",
    },
    {
      title: "Carga de contenido",
      desc: "Subimos platos, descripciones, precios y fotos. El restaurante no toca nada técnico.",
    },
    {
      title: "QR listo para imprimir",
      desc: "Para mesas, entrada e Instagram. Listo el mismo día.",
    },
    {
      title: "Informe de los primeros 30 días",
      desc: "Qué platos generan más interés, cuánto tiempo pasan en cada sección, qué ignoran. Con recomendaciones concretas para optimizar tu menú y vender más de lo que más te conviene.",
    },
  ];

  return (
    <section id="precios" className="py-20 sm:py-28" style={{ backgroundColor: "#F7F6F4" }}>
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-14">
          <p
            className="mb-3 text-[10px] font-semibold uppercase tracking-widest"
            style={{ fontFamily: "var(--font-inter)", color: "#5C5B58" }}
          >
            Precio fundador
          </p>
          <h2
            className="text-3xl font-bold sm:text-4xl"
            style={{ fontFamily: "var(--font-inter)", color: "#1C1B19" }}
          >
            Un servicio, no una suscripción de software.
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <div className="space-y-3">
            {included.map(({ title, desc }) => (
              <div
                key={title}
                className="flex gap-4 rounded-xl p-4"
                style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(28,27,25,0.07)" }}
              >
                <div
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: "#1C1B19" }}
                >
                  <Check className="h-3 w-3 text-white" />
                </div>
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ fontFamily: "var(--font-inter)", color: "#1C1B19" }}
                  >
                    {title}
                  </p>
                  <p
                    className="mt-0.5 text-xs leading-relaxed"
                    style={{ fontFamily: "var(--font-inter)", color: "#5C5B58" }}
                  >
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Price card */}
          <div className="w-full rounded-2xl p-7 lg:w-72" style={{ backgroundColor: "#1C1B19" }}>
            <p
              className="text-[10px] font-semibold uppercase tracking-widest"
              style={{ fontFamily: "var(--font-inter)", color: "rgba(255,255,255,0.35)" }}
            >
              Precio fundador
            </p>

            <div className="mt-5">
              <p
                className="text-xs"
                style={{ fontFamily: "var(--font-inter)", color: "rgba(255,255,255,0.4)" }}
              >
                Setup (pago único)
              </p>
              <p
                className="mt-1 text-3xl font-bold"
                style={{ fontFamily: "var(--font-inter)", color: "#F5F0E8" }}
              >
                $180.000{" "}
                <span className="text-sm font-normal" style={{ color: "rgba(255,255,255,0.3)" }}>
                  CLP
                </span>
              </p>
            </div>

            <div className="my-5" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} />

            <div>
              <p
                className="text-xs"
                style={{ fontFamily: "var(--font-inter)", color: "rgba(255,255,255,0.4)" }}
              >
                Plataforma mensual
              </p>
              <p
                className="mt-1 text-3xl font-bold"
                style={{ fontFamily: "var(--font-inter)", color: "#F5F0E8" }}
              >
                $49.000{" "}
                <span className="text-sm font-normal" style={{ color: "rgba(255,255,255,0.3)" }}>
                  CLP/mes
                </span>
              </p>
            </div>

            <div className="my-5" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} />

            <a
              href={WA_FOUNDER}
              className="flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{
                fontFamily: "var(--font-inter)",
                backgroundColor: "#F5F0E8",
                color: "#1C1B19",
              }}
            >
              Quiero ser fundador
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>

            <p
              className="mt-4 text-center text-xs"
              style={{ fontFamily: "var(--font-inter)", color: "rgba(255,255,255,0.22)" }}
            >
              Solo 3 cupos disponibles
            </p>
          </div>
        </div>

        <p
          className="mt-6 text-xs"
          style={{ fontFamily: "var(--font-inter)", color: "rgba(28,27,25,0.3)" }}
        >
          Precio estándar desde $500.000 CLP setup + $80.000 CLP/mes · Lista de espera abierta
        </p>
      </div>
    </section>
  );
}

/* ─── CTA Final ──────────────────────────────────────────── */
function FinalCTASection() {
  return (
    <section className="py-24 sm:py-32" style={{ backgroundColor: "#1C1B19" }}>
      <div className="mx-auto max-w-2xl px-5 text-center">
        <h2
          className="text-3xl font-bold leading-tight sm:text-4xl"
          style={{ fontFamily: "var(--font-inter)", color: "#F5F0E8" }}
        >
          ¿Tu restaurante entra en la lista?
        </h2>
        <p
          className="mt-4 text-base leading-relaxed"
          style={{ fontFamily: "var(--font-inter)", color: "rgba(245,240,232,0.45)" }}
        >
          Teist trabaja con máximo 20 restaurantes en Santiago.
          Cada carta se diseña a mano. Si te interesa, conversamos.
        </p>
        <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href={WA_LINK}
            className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold transition-opacity hover:opacity-80"
            style={{
              fontFamily: "var(--font-inter)",
              backgroundColor: "#F5F0E8",
              color: "#1C1B19",
            }}
          >
            Escribir a Richi
            <ArrowUpRight className="h-4 w-4" />
          </a>
          <a
            href="mailto:hola@teist.app"
            className="text-sm transition-opacity hover:opacity-80"
            style={{ fontFamily: "var(--font-inter)", color: "rgba(245,240,232,0.35)" }}
          >
            hola@teist.app
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─────────────────────────────────────────────── */
function Footer() {
  return (
    <footer
      className="py-10"
      style={{ backgroundColor: "#1C1B19", borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <span
            className="text-base font-semibold"
            style={{ fontFamily: "var(--font-playfair)", color: "#F5F0E8" }}
          >
            Teist
          </span>
          <nav className="flex flex-wrap gap-5">
            {[
              { label: "Cómo funciona", href: "#como-funciona" },
              { label: "Precios", href: "#precios" },
              { label: "Demo", href: "/r/demo" },
              { label: "Ingresar", href: "/login" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-sm transition-opacity hover:opacity-70"
                style={{ fontFamily: "var(--font-inter)", color: "rgba(245,240,232,0.35)" }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <p
          className="mt-8 text-xs"
          style={{ fontFamily: "var(--font-inter)", color: "rgba(245,240,232,0.18)" }}
        >
          © 2026 Teist · teist.app
        </p>
      </div>
    </footer>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <HowItWorksSection />
      <FeatureAnalytics />
      <FeatureAvailability />
      <FeatureSplashIdentity />
      <PricingSection />
      <FinalCTASection />
      <Footer />
    </>
  );
}

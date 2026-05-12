import type { Metadata } from "next";
import Link from "next/link";
import { Store, ChefHat, Palette, QrCode, Utensils, Coffee, Wine, ArrowRight } from "lucide-react";
import { DemoSheet } from "@/components/landing/DemoSheet";
import { PortfolioCarousel } from "@/components/landing/PortfolioCarousel";

export const metadata: Metadata = {
  title: "Teist — Carta digital para restaurantes boutique",
  description:
    "Cartas digitales diseñadas a medida para restaurantes con identidad de marca. Analytics, splash screen inmersiva y actualización en tiempo real.",
};

/* ─── Navbar ─────────────────────────────────────────────── */
function Navbar() {
  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b border-[#0A0A0A]/10 bg-[#FAFAF7]"
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <span
          style={{ fontFamily: "var(--font-space-grotesk)" }}
          className="text-lg font-bold text-[#0A0A0A]"
        >
          Teist
        </span>
        <nav className="flex items-center gap-6">
          <Link
            href="#como-funciona"
            style={{ fontFamily: "var(--font-inter)" }}
            className="hidden text-sm text-[#6B6B6B] hover:text-[#0A0A0A] sm:block"
          >
            Cómo funciona
          </Link>
          <Link
            href="#precios"
            style={{ fontFamily: "var(--font-inter)" }}
            className="hidden text-sm text-[#6B6B6B] hover:text-[#0A0A0A] sm:block"
          >
            Precios
          </Link>
          <Link
            href="/login"
            style={{ fontFamily: "var(--font-inter)" }}
            className="rounded-lg border-2 border-[#0A0A0A] bg-[#D4F000] px-4 py-1.5 text-sm font-semibold text-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#0A0A0A] active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            Solicitar acceso →
          </Link>
        </nav>
      </div>
    </header>
  );
}

/* ─── Phone splash mockup ────────────────────────────────── */
function PhoneMockup() {
  return (
    <div
      className="relative mx-auto w-[220px]"
      style={{
        filter: "drop-shadow(6px 6px 0px #0A0A0A)",
      }}
    >
      {/* Frame */}
      <div className="rounded-[2.5rem] border-[7px] border-[#0A0A0A] bg-[#0A0A0A]">
        {/* Notch */}
        <div className="mx-auto h-5 w-20 rounded-b-xl bg-[#1A1A1A]" />

        {/* Screen — splash */}
        <div className="flex flex-col items-center justify-center overflow-hidden rounded-[1.8rem] bg-[#111111]" style={{ minHeight: 390 }}>
          {/* Background image placeholder */}
          <div className="absolute inset-0 rounded-[1.8rem] bg-gradient-to-b from-[#1A1A1A] to-[#0A0A0A]" />

          {/* Content */}
          <div className="relative flex flex-col items-center gap-4 px-6 text-center">
            {/* Logo circle */}
            <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/20 bg-white text-xl font-bold text-[#0A0A0A]"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              B
            </div>
            <div>
              <p
                className="text-base font-bold text-white"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Boragó
              </p>
              <p className="mt-0.5 text-[11px] text-white/50"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Cocina de raíces chilenas
              </p>
            </div>
            <button
              className="mt-2 rounded-lg border-2 border-white/20 bg-white/10 px-5 py-2 text-xs font-semibold text-white backdrop-blur-sm"
              style={{ fontFamily: "var(--font-inter)" }}
              tabIndex={-1}
            >
              Ver carta
            </button>
          </div>
        </div>

        {/* Home bar */}
        <div className="mx-auto my-2 h-1 w-16 rounded-full bg-[#333]" />
      </div>
    </div>
  );
}

/* ─── Hero ───────────────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#FAFAF7] pb-16 pt-24 sm:pb-24 sm:pt-32">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Copy */}
          <div>
            <div
              className="mb-5 inline-flex items-center gap-2 rounded-lg border-2 border-[#0A0A0A] bg-[#FAFAF7] px-3 py-1.5 text-xs font-semibold text-[#0A0A0A]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4F000]" />
              Para restaurantes con criterio
            </div>

            <h1
              className="text-3xl font-bold leading-[1.1] tracking-tight text-[#0A0A0A] sm:text-5xl lg:text-6xl"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Tu restaurante tiene identidad.{" "}
              <span className="text-[#6B6B6B]">Tu carta también.</span>
            </h1>

            <p
              className="mt-6 text-lg leading-relaxed text-[#6B6B6B]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Diseñamos cartas digitales que se ven como extensión real de tu
              marca. Con analytics de lo que más pide tu clientela.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 rounded-lg border-2 border-[#0A0A0A] bg-[#D4F000] px-6 py-3 text-sm font-semibold text-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#0A0A0A] active:translate-x-1 active:translate-y-1 active:shadow-none sm:inline-flex"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Solicitar acceso
                <ArrowRight className="h-4 w-4" />
              </Link>
              <DemoSheet slug="demo" />
            </div>
          </div>

          {/* Visual — hidden on mobile to save vertical space */}
          <div className="hidden justify-center lg:flex lg:justify-end">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Para quién es ──────────────────────────────────────── */
function ForWhomSection() {
  const cards = [
    {
      Icon: Utensils,
      title: "Fine dining & bistrós",
      desc: "Menús de degustación, maridajes y nombres de platos que comunican cada detalle. La carta como pieza de diseño.",
    },
    {
      Icon: Coffee,
      title: "Cafeterías de especialidad",
      desc: "Carta de specialty coffee, brunch y temporada. Actualiza precios al instante. Tu marca visible en cada detalle.",
    },
    {
      Icon: Wine,
      title: "Bares de cóctel de autor",
      desc: "Ingredientes, historia del trago y disponibilidad de temporada. Experiencia premium antes del primer sorbo.",
    },
  ];

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 text-center sm:mb-14">
          <h2
            className="text-3xl font-bold tracking-tight text-[#0A0A0A] sm:text-4xl"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            No es para todos.
          </h2>
          <p
            className="mt-3 text-[#6B6B6B]"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Es para quienes ya cuidan cada detalle de su marca.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {cards.map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-lg border-2 border-[#0A0A0A] bg-white p-6"
              style={{ boxShadow: "4px 4px 0px #0A0A0A" }}
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center bg-[#0A0A0A] text-white">
                <Icon className="h-5 w-5" />
              </div>
              <h3
                className="mb-2 text-base font-bold text-[#0A0A0A]"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                {title}
              </h3>
              <p
                className="text-sm leading-relaxed text-[#6B6B6B]"
                style={{ fontFamily: "var(--font-inter)" }}
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

/* ─── Cómo funciona ──────────────────────────────────────── */
function HowItWorksSection() {
  const steps = [
    {
      Icon: Store,
      n: "01",
      title: "Nos contactas",
      desc: "Conversamos sobre tu restaurante, tu identidad y qué hace única tu carta.",
    },
    {
      Icon: ChefHat,
      n: "02",
      title: "Cargamos tu menú",
      desc: "Subimos categorías, platos, precios y fotos. Tú no tienes que aprender nada.",
    },
    {
      Icon: Palette,
      n: "03",
      title: "Elegimos juntos el estilo",
      desc: "Cuatro sistemas visuales distintos. Escogemos el que mejor represente tu marca.",
    },
    {
      Icon: QrCode,
      n: "04",
      title: "Tu carta está online",
      desc: "QR listo para mesas, entrada e Instagram. Actualizaciones en tiempo real desde ese día.",
    },
  ];

  return (
    <section id="como-funciona" className="bg-[#FAFAF7] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 text-center sm:mb-14">
          <h2
            className="text-3xl font-bold tracking-tight text-[#0A0A0A] sm:text-4xl"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            En 4 pasos, tu carta está online
          </h2>
        </div>

        <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Connector line (desktop) */}
          <div
            aria-hidden
            className="absolute left-[12.5%] right-[12.5%] top-5 hidden h-0.5 bg-[#0A0A0A] lg:block"
          />

          {steps.map(({ Icon, n, title, desc }) => (
            <div key={n} className="relative flex flex-col items-center text-center">
              <div className="relative z-10 mb-5 flex h-10 w-10 items-center justify-center border-2 border-[#0A0A0A] bg-white"
                style={{ boxShadow: "2px 2px 0px #0A0A0A" }}
              >
                <Icon className="h-4 w-4 text-[#0A0A0A]" />
              </div>
              <span
                className="mb-1 text-3xl font-bold text-[#0A0A0A]"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                {n}
              </span>
              <h3
                className="mb-2 text-sm font-bold text-[#0A0A0A]"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                {title}
              </h3>
              <p
                className="text-xs leading-relaxed text-[#6B6B6B]"
                style={{ fontFamily: "var(--font-inter)" }}
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

/* ─── Demo ───────────────────────────────────────────────── */
function DemoSection() {
  return (
    <section className="bg-[#0A0A0A] py-16 sm:py-24">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <h2
          className="mb-4 text-3xl font-bold text-white sm:text-4xl"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Abre una carta real
        </h2>
        <p
          className="mb-10 text-[#6B6B6B]"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Escanea, navega, filtra. Exactamente lo que verá quien se siente en tu
          mesa esta noche.
        </p>
        <DemoSheet slug="demo" />
      </div>
    </section>
  );
}

/* ─── Portfolio ──────────────────────────────────────────── */
function PortfolioSection() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 sm:mb-14">
          <h2
            className="text-3xl font-bold tracking-tight text-[#0A0A0A] sm:text-4xl"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Cartas que ya están online
          </h2>
          <p
            className="mt-2 text-[#6B6B6B]"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Cada una diseñada a medida. Ninguna parece template.
          </p>
        </div>
        <PortfolioCarousel />
      </div>
    </section>
  );
}

/* ─── Pricing ────────────────────────────────────────────── */
function PricingSection() {
  const setupItems = [
    "Diseño de carta con tu identidad de marca",
    "Configuración completa del sistema",
    "Carga inicial de tu menú",
    "Onboarding personalizado",
  ];

  const platformItems = [
    "Actualizaciones ilimitadas",
    "Analytics de carta",
    "QR descargable",
    "Soporte directo con Richi",
  ];

  return (
    <section id="precios" className="bg-[#FAFAF7] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 text-center sm:mb-14">
          <h2
            className="text-3xl font-bold tracking-tight text-[#0A0A0A] sm:text-4xl"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Inversión, no suscripción genérica.
          </h2>
        </div>

        <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
          {/* Card 1 — Setup */}
          <div
            className="rounded-lg border-2 border-[#0A0A0A] bg-white p-5 sm:p-8"
            style={{ boxShadow: "4px 4px 0px #0A0A0A" }}
          >
            <p
              className="text-sm font-semibold text-[#6B6B6B]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Diseño a medida
            </p>
            <div className="mt-2 flex items-baseline gap-1">
              <span
                className="text-2xl font-bold text-[#0A0A0A] sm:text-4xl"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                desde $500.000
              </span>
            </div>
            <p
              className="mt-1 text-sm text-[#6B6B6B]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              CLP
            </p>
            <ul className="mt-6 space-y-2.5">
              {setupItems.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-[#0A0A0A]"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0A0A0A]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Card 2 — Platform */}
          <div
            className="rounded-lg border-2 border-[#0A0A0A] bg-[#D4F000] p-5 sm:p-8"
            style={{ boxShadow: "4px 4px 0px #0A0A0A" }}
          >
            <p
              className="text-sm font-semibold text-[#0A0A0A]/60"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Plataforma + soporte
            </p>
            <div className="mt-2 flex items-baseline gap-1">
              <span
                className="text-4xl font-bold text-[#0A0A0A]"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                desde $80.000
              </span>
            </div>
            <p
              className="mt-1 text-sm text-[#0A0A0A]/60"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              CLP / mes
            </p>
            <ul className="mt-6 space-y-2.5">
              {platformItems.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-[#0A0A0A]"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0A0A0A]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Founder note */}
        <p
          className="mx-auto mt-6 max-w-md text-center text-sm text-[#6B6B6B]"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Los primeros 5 restaurantes acceden a precio especial. A cambio,
          documentamos juntos la historia.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
          <a
            href="https://wa.me/56XXXXXXXXX?text=Hola%20Richi%2C%20me%20interesa%20Teist%20para%20mi%20restaurante"
            className="flex items-center justify-center gap-2 rounded-lg border-2 border-[#0A0A0A] bg-[#0A0A0A] px-6 py-3 text-sm font-semibold text-white shadow-[4px_4px_0px_#333] transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#333] active:translate-x-1 active:translate-y-1 active:shadow-none sm:inline-flex"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Conversemos →
          </a>
          <a
            href="mailto:hola@teist.app"
            className="flex items-center justify-center gap-2 rounded-lg border-2 border-[#0A0A0A] bg-[#FAFAF7] px-6 py-3 text-sm font-semibold text-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#0A0A0A] active:translate-x-1 active:translate-y-1 active:shadow-none sm:inline-flex"
            style={{ fontFamily: "var(--font-inter)" }}
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
    <footer className="bg-[#0A0A0A] py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <span
              className="text-lg font-bold text-white"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Teist
            </span>
            <p
              className="mt-1 text-xs text-[#6B6B6B]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              La carta que merece tu restaurante.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-5">
            {[
              { label: "Inicio", href: "/" },
              { label: "Precios", href: "#precios" },
              { label: "Demo", href: "#demo" },
              { label: "Ingresar", href: "/login" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-xs text-[#6B6B6B] transition hover:text-white"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div
          className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-[#6B6B6B]"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          © 2026 Teist · teist.app
        </div>
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
      <ForWhomSection />
      <HowItWorksSection />
      <DemoSection />
      <PortfolioSection />
      <PricingSection />
      <Footer />
    </>
  );
}

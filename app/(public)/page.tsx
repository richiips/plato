import Link from "next/link";
import {
  Store,
  ChefHat,
  Paintbrush,
  QrCode,
  Check,
  Phone,
  Coffee,
  Wine,
  Utensils,
  ArrowRight,
} from "lucide-react";
import { DemoSheet } from "@/components/landing/DemoSheet";
import { PortfolioCarousel } from "@/components/landing/PortfolioCarousel";

/* ─── Nav ────────────────────────────────────────────────── */
function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <span className="text-sm font-bold tracking-tight text-white">carta·digital</span>
        <nav className="flex items-center gap-6">
          <Link href="#como-funciona" className="hidden text-sm text-zinc-400 hover:text-white sm:block">
            Cómo funciona
          </Link>
          <Link href="#precios" className="hidden text-sm text-zinc-400 hover:text-white sm:block">
            Precios
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-100"
          >
            Ingresar
          </Link>
        </nav>
      </div>
    </header>
  );
}

/* ─── Hero ───────────────────────────────────────────────── */
function PhoneMockup() {
  const items = [
    { name: "Burrata con higos", price: "$12.000", tag: "Nuevo" },
    { name: "Risotto al funghi", price: "$19.000", tag: null },
    { name: "Lomo de res", price: "$26.000", tag: "Chef" },
  ];

  return (
    <div
      className="relative mx-auto w-[230px]"
      style={{
        transform: "perspective(900px) rotateY(-8deg) rotateX(3deg)",
        filter: "drop-shadow(0 32px 48px rgba(0,0,0,0.6))",
      }}
    >
      {/* Frame */}
      <div className="rounded-[2.5rem] border-[7px] border-zinc-700 bg-zinc-800">
        {/* Notch */}
        <div className="mx-auto h-5 w-20 rounded-b-xl bg-zinc-700" />

        {/* Screen */}
        <div className="overflow-hidden rounded-[1.6rem] bg-white">
          {/* Restaurant header */}
          <div className="flex h-24 items-end bg-zinc-900 px-4 pb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-base font-bold text-zinc-900">
              B
            </div>
            <div className="ml-2.5">
              <p className="text-sm font-bold text-white">Bellini Bistro</p>
              <p className="text-[10px] text-zinc-400">Cocina italiana de autor</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto px-3 py-2.5">
            {["Entradas", "Pastas", "Postres"].map((t, i) => (
              <span
                key={t}
                className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                  i === 0
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-100 text-zinc-500"
                }`}
              >
                {t}
              </span>
            ))}
          </div>

          {/* Items */}
          <div className="space-y-2 px-3 pb-4">
            {items.map(({ name, price, tag }) => (
              <div
                key={name}
                className="flex items-center justify-between rounded-xl border border-zinc-100 px-2.5 py-2"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-[11px] font-semibold text-zinc-900">{name}</p>
                    {tag && (
                      <span className="rounded-full bg-zinc-900 px-1.5 py-px text-[8px] font-medium text-white">
                        {tag}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[9px] text-zinc-400">Descripción breve del plato</p>
                </div>
                <span className="ml-2 shrink-0 text-[11px] font-bold text-zinc-900">{price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Home bar */}
        <div className="mx-auto my-2 h-1 w-16 rounded-full bg-zinc-600" />
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 pb-24 pt-32">
      {/* Subtle grid bg */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Copy */}
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
              Sin apps · Sin impresión · 100% digital
            </div>

            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
              La carta digital que merece tu{" "}
              <span className="text-zinc-400">restaurante</span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-zinc-400">
              Crea tu menú online con tu identidad visual, compártelo con un QR
              y actualízalo en tiempo real. Sin comisiones, sin apps.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
              >
                Empieza gratis
                <ArrowRight className="h-4 w-4" />
              </Link>
              <DemoSheet slug="demo" />
            </div>

            <p className="mt-4 text-xs text-zinc-600">
              Sin tarjeta de crédito · Configuración en 10 minutos
            </p>
          </div>

          {/* Visual */}
          <div className="flex justify-center lg:justify-end">
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
      title: "Fine dining & bistros",
      desc: "Menú de degustación con maridaje, precios dinámicos y nombres de platos en múltiples idiomas para turistas internacionales.",
      traits: ["Multilingüe", "Fotos HD por plato", "Alérgenos detallados"],
    },
    {
      Icon: Coffee,
      title: "Cafeterías & brunch",
      desc: "Carta de specialty coffee, bowls y tostadas que cambia por temporada. Actualiza precios al instante desde el móvil.",
      traits: ["Actualización en tiempo real", "Toggle sold-out", "Filtro vegano/sin gluten"],
    },
    {
      Icon: Wine,
      title: "Bares & coctelerías",
      desc: "Carta de cócteles con descripción de ingredientes, maridajes y disponibilidad de temporada. Experiencia premium para el cliente.",
      traits: ["Diseño personalizado", "Filtros por espirituosa", "Carta de vinos integrada"],
    },
  ];

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Para restaurantes con criterio
          </h2>
          <p className="mt-3 text-zinc-500">
            No es para todos. Es para quienes cuidan cada detalle.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {cards.map(({ Icon, title, desc, traits }) => (
            <div
              key={title}
              className="group rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm transition hover:border-zinc-300 hover:shadow-md"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-zinc-900">{title}</h3>
              <p className="mb-4 text-sm leading-relaxed text-zinc-500">{desc}</p>
              <ul className="space-y-1.5">
                {traits.map((t) => (
                  <li key={t} className="flex items-center gap-2 text-xs text-zinc-500">
                    <Check className="h-3.5 w-3.5 shrink-0 text-green-500" />
                    {t}
                  </li>
                ))}
              </ul>
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
      title: "Crea tu restaurante",
      desc: "Rellena los datos básicos: nombre, slug, descripción y datos de contacto. Listo en 5 minutos.",
    },
    {
      Icon: ChefHat,
      n: "02",
      title: "Sube tu menú",
      desc: "Agrega categorías y platos con fotos, precios, etiquetas dietéticas y modificadores.",
    },
    {
      Icon: Paintbrush,
      n: "03",
      title: "Personaliza el diseño",
      desc: "Elige tus colores corporativos y tipografía. El preview en vivo muestra el resultado al instante.",
    },
    {
      Icon: QrCode,
      n: "04",
      title: "Comparte el QR",
      desc: "Descarga tu QR y ponlo en las mesas, la entrada o tu perfil de Instagram.",
    },
  ];

  return (
    <section id="como-funciona" className="bg-zinc-50 py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            En 4 pasos, tu carta está online
          </h2>
        </div>

        <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Connector line (desktop) */}
          <div
            aria-hidden
            className="absolute left-[12.5%] right-[12.5%] top-5 hidden h-px bg-zinc-200 lg:block"
          />

          {steps.map(({ Icon, n, title, desc }) => (
            <div key={n} className="relative flex flex-col items-center text-center">
              <div className="relative z-10 mb-5 flex h-10 w-10 items-center justify-center rounded-full border-2 border-zinc-900 bg-white">
                <Icon className="h-4 w-4 text-zinc-900" />
              </div>
              <span className="mb-1 font-mono text-xs text-zinc-400">{n}</span>
              <h3 className="mb-2 text-sm font-semibold text-zinc-900">{title}</h3>
              <p className="text-xs leading-relaxed text-zinc-500">{desc}</p>
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
    <section className="bg-zinc-950 py-24">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <p className="mb-3 font-mono text-xs text-zinc-500">DEMO EN VIVO</p>
        <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
          Abre la carta como lo hará tu cliente
        </h2>
        <p className="mb-10 text-zinc-400">
          Escanea el QR, toca las categorías, filtra por dieta. Exactamente la experiencia
          que tendrá quien se siente a tu mesa.
        </p>
        <DemoSheet slug="demo" />
        <p className="mt-4 text-xs text-zinc-600">
          La carta de demostración se abre directamente en esta ventana.
        </p>
      </div>
    </section>
  );
}

/* ─── Portafolio ─────────────────────────────────────────── */
function PortfolioSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-14 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              Cartas que ya están online
            </h2>
            <p className="mt-2 text-zinc-500">Ejemplos de lo que puedes crear.</p>
          </div>
        </div>
        <PortfolioCarousel />
      </div>
    </section>
  );
}

/* ─── Pricing ────────────────────────────────────────────── */
const FEATURES = [
  "Carta digital con QR único",
  "Editor de menú con drag & drop",
  "Diseño personalizado (colores, tipografía)",
  "Imágenes optimizadas con Cloudflare",
  "Soporte multilingüe (ES / EN / PT / FR)",
  "Estadísticas de visitas",
  "Actualización en tiempo real",
  "Sin comisiones por pedido",
];

function PricingSection() {
  return (
    <section id="precios" className="bg-zinc-50 py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Un precio. Todo incluido.
          </h2>
          <p className="mt-3 text-zinc-500">Sin sorpresas, sin letra chica.</p>
        </div>

        <div className="mx-auto max-w-sm">
          <div className="relative overflow-hidden rounded-2xl border-2 border-zinc-900 bg-white p-8 shadow-xl">
            {/* Badge */}
            <div className="absolute right-4 top-4 rounded-full bg-zinc-900 px-2.5 py-1 text-[10px] font-semibold text-white">
              LANZAMIENTO
            </div>

            <p className="text-sm font-medium text-zinc-500">Plan Pro</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-5xl font-bold text-zinc-900">$29</span>
              <span className="text-zinc-500">USD / mes</span>
            </div>
            <p className="mt-1 text-xs text-zinc-400">por restaurante · cancela cuando quieras</p>

            <ul className="mt-8 space-y-3">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-600">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-8 space-y-3">
              <a
                href="mailto:hola@carta.digital?subject=Quiero%20agendar%20una%20llamada"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-zinc-900 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700"
              >
                <Phone className="h-4 w-4" />
                Agenda una llamada
              </a>
              <Link
                href="/login"
                className="flex w-full items-center justify-center rounded-full border border-zinc-200 py-3 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400"
              >
                Probar gratis 14 días
              </Link>
            </div>

            <p className="mt-4 text-center text-xs text-zinc-400">
              Sin tarjeta de crédito para el trial
            </p>
          </div>

          {/* Social proof */}
          <p className="mt-6 text-center text-sm text-zinc-500">
            ¿Varios locales? Contacta para precios de agencia.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-zinc-100 bg-zinc-950 py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <span className="text-sm font-bold text-white">carta·digital</span>
            <p className="mt-1 text-xs text-zinc-500">
              La carta digital que merece tu restaurante.
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
                key={href}
                href={href}
                className="text-xs text-zinc-500 transition hover:text-zinc-300"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 border-t border-zinc-800 pt-6 text-center text-xs text-zinc-600">
          © {new Date().getFullYear()} carta·digital. Construido con Next.js y Supabase.
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

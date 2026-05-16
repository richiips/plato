import type { Metadata } from "next";
import { Space_Grotesk, Inter, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Teist — Carta digital para restaurantes boutique",
  description:
    "Cartas digitales diseñadas a medida para restaurantes con identidad de marca. Analytics, splash screen inmersiva y actualización en tiempo real.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className={`${spaceGrotesk.variable} ${inter.variable} ${playfair.variable}`}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}

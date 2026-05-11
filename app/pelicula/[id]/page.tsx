import { PELICULAS } from "@/lib/mock-data";
import PeliculaDetalle from "@/components/PeliculaDetalle";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return PELICULAS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const pelicula = PELICULAS.find((p) => p.id === id);
  if (!pelicula) return { title: "Película no encontrada — CineCompara" };
  return {
    title: `${pelicula.titulo} — CineCompara Chile`,
    description: pelicula.sinopsis,
  };
}

export default async function PeliculaPage({ params }: Props) {
  const { id } = await params;
  return <PeliculaDetalle peliculaId={id} />;
}

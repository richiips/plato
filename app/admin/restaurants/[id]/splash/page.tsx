import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SplashEditor } from "@/components/admin/SplashEditor";
import type { Restaurant } from "@/types/database";

export default async function SplashAdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", id)
    .single<Restaurant>();

  if (!restaurant) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href={`/admin/restaurants/${id}`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            {restaurant.name}
          </Link>
          <h1 className="mt-2 text-2xl font-bold">Pantalla de entrada</h1>
          <p className="text-sm text-muted-foreground">
            Lo primero que ve el comensal al escanear el QR.
          </p>
        </div>
        <a
          href={`/r/${restaurant.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ExternalLink className="h-4 w-4" />
          Ver splash
        </a>
      </div>

      <div className="mx-auto max-w-2xl">
        <SplashEditor restaurant={restaurant} />
      </div>
    </div>
  );
}

import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { requireSuperAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { BrandingEditor } from "@/components/admin/BrandingEditor";
import type { Restaurant } from "@/types/database";

export default async function BrandingPage({ params }: { params: Promise<{ id: string }> }) {
  await requireSuperAdmin();
  const { id } = await params;
  const supabase = await createClient();

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", id)
    .single<Restaurant>();

  if (!restaurant) notFound();

  return (
    <div className="space-y-4">
      <div>
        <Link
          href={`/admin/restaurants/${id}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Volver
        </Link>
        <h2 className="mt-2 text-lg font-semibold">Branding</h2>
        <p className="text-sm text-muted-foreground">
          Personaliza colores, tipografía e imágenes de la carta.
        </p>
      </div>
      <BrandingEditor restaurant={restaurant} />
    </div>
  );
}

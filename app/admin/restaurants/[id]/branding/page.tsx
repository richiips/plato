import { notFound } from "next/navigation";
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
        <h2 className="text-lg font-semibold">Branding</h2>
        <p className="text-sm text-muted-foreground">
          Personaliza colores, tipografía e imágenes de la carta.
        </p>
      </div>
      <BrandingEditor restaurant={restaurant} />
    </div>
  );
}

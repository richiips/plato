import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { RestaurantsTable } from "@/components/admin/RestaurantsTable";
import type { Restaurant } from "@/types/database";

export default async function RestaurantsPage() {
  const supabase = await createClient();
  const { data: restaurants } = await supabase
    .from("restaurants")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Restaurant[]>();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Restaurantes</h1>
          <p className="text-sm text-muted-foreground">
            {restaurants?.length ?? 0} restaurantes en la plataforma
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/restaurants/new">
            <Plus className="mr-1.5 h-4 w-4" />
            Nuevo restaurante
          </Link>
        </Button>
      </div>

      <RestaurantsTable restaurants={restaurants ?? []} />
    </div>
  );
}

import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { RestaurantForm } from "@/components/admin/RestaurantForm";
import { updateRestaurant } from "@/lib/actions/restaurants";
import type { Restaurant } from "@/types/database";

export default async function RestaurantDetailPage({
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

  const boundUpdate = updateRestaurant.bind(null, id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <div className="mt-2 flex items-center gap-3">
            <h1 className="text-2xl font-bold">{restaurant.name}</h1>
            <Badge variant={restaurant.is_published ? "default" : "secondary"}>
              {restaurant.is_published ? "Live" : "Draft"}
            </Badge>
          </div>
          <p className="mt-0.5 font-mono text-sm text-muted-foreground">/r/{restaurant.slug}</p>
        </div>
        <Link
          href={`/r/${restaurant.slug}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ExternalLink className="h-4 w-4" />
          Ver carta
        </Link>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="splash" asChild>
            <Link href={`/admin/restaurants/${id}/splash`}>Splash</Link>
          </TabsTrigger>
          <TabsTrigger value="menu" asChild>
            <Link href={`/admin/restaurants/${id}/menu`}>Menú</Link>
          </TabsTrigger>
          <TabsTrigger value="branding" asChild>
            <Link href={`/admin/restaurants/${id}/branding`}>Branding</Link>
          </TabsTrigger>
          <TabsTrigger value="members" asChild>
            <Link href={`/admin/restaurants/${id}/members`}>Miembros</Link>
          </TabsTrigger>
          <TabsTrigger value="analytics" asChild>
            <Link href={`/admin/restaurants/${id}/analytics`}>Analytics</Link>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-6">
          <div className="mx-auto max-w-3xl">
            <RestaurantForm
              action={boundUpdate}
              restaurant={restaurant}
              submitLabel="Guardar cambios"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

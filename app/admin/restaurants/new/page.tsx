import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { RestaurantForm } from "@/components/admin/RestaurantForm";
import { createRestaurant } from "@/lib/actions/restaurants";

export default function NewRestaurantPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/admin/restaurants"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Restaurantes
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Nuevo restaurante</h1>
      </div>

      <RestaurantForm action={createRestaurant} submitLabel="Crear restaurante" />
    </div>
  );
}

import { getDashboardContext } from "@/lib/actions/dashboard";
import { BrandingEditor } from "@/components/admin/BrandingEditor";

export default async function DashboardBrandingPage() {
  const { restaurant } = await getDashboardContext();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Branding</h1>
        <p className="text-sm text-muted-foreground">
          Personaliza colores, tipografía e imágenes de tu carta.
        </p>
      </div>
      <BrandingEditor restaurant={restaurant} />
    </div>
  );
}

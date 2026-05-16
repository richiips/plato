import { getDashboardContext } from "@/lib/actions/dashboard";
import { BrandingEditor } from "@/components/admin/BrandingEditor";

export default async function DashboardBrandingPage() {
  const { restaurant } = await getDashboardContext();

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Identidad visual
        </p>
        <h1 className="mt-1 text-2xl font-bold">Branding</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Personaliza colores, tipografía e imágenes de tu carta.
        </p>
      </div>
      <BrandingEditor restaurant={restaurant} />
    </div>
  );
}

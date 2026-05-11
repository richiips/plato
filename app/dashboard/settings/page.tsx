import { getDashboardContext } from "@/lib/actions/dashboard";
import { DashboardSettingsForm } from "@/components/dashboard/DashboardSettingsForm";

export default async function DashboardSettingsPage() {
  const { restaurant, member } = await getDashboardContext();
  const canEdit = member.role === "owner" || member.role === "manager";

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Configuración</h1>
        <p className="text-sm text-muted-foreground">
          Información pública de tu restaurante.
        </p>
      </div>
      {canEdit ? (
        <div className="mx-auto max-w-2xl">
          <DashboardSettingsForm restaurant={restaurant} />
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Solo owners y managers pueden editar la configuración.
        </p>
      )}
    </div>
  );
}

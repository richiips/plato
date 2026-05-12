import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { requireSuperAdmin } from "@/lib/auth";
import { getMembers } from "@/lib/actions/members";
import { MembersEditor } from "@/components/admin/MembersEditor";

export default async function MembersPage({ params }: { params: Promise<{ id: string }> }) {
  await requireSuperAdmin();
  const { id } = await params;
  const members = await getMembers(id);

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
        <h2 className="mt-2 text-lg font-semibold">Miembros del equipo</h2>
        <p className="text-sm text-muted-foreground">
          Gestiona quién tiene acceso al dashboard de este restaurante.
        </p>
      </div>
      <MembersEditor restaurantId={id} members={members} />
    </div>
  );
}

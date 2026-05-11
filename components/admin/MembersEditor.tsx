"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, UserMinus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { inviteMember, removeMember, updateMemberRole } from "@/lib/actions/members";
import type { MemberWithProfile } from "@/lib/actions/members";
import type { MemberRole } from "@/types/database";

const ROLE_LABELS: Record<MemberRole, string> = {
  owner: "Dueño",
  manager: "Manager",
  staff: "Personal",
};

const ROLE_COLORS: Record<MemberRole, "default" | "secondary" | "outline"> = {
  owner: "default",
  manager: "secondary",
  staff: "outline",
};

function InviteSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Invitar
    </Button>
  );
}

interface MembersEditorProps {
  restaurantId: string;
  members: MemberWithProfile[];
}

export function MembersEditor({ restaurantId, members }: MembersEditorProps) {
  const boundInvite = inviteMember.bind(null, restaurantId);
  const [state, formAction] = useActionState(boundInvite, {});

  async function handleRemove(memberId: string, email: string) {
    if (!confirm(`¿Eliminar a ${email} del equipo?`)) return;
    await removeMember(restaurantId, memberId);
    toast.success("Miembro eliminado");
  }

  async function handleRoleChange(memberId: string, role: MemberRole) {
    await updateMemberRole(restaurantId, memberId, role);
    toast.success("Rol actualizado");
  }

  return (
    <div className="space-y-8">
      {/* Members table */}
      <div className="rounded-xl border border-border bg-background">
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold">Equipo ({members.length})</h2>
        </div>

        {members.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">No hay miembros aún.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Miembro desde</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{m.profile.full_name ?? "Sin nombre"}</p>
                      <p className="text-xs text-muted-foreground">{m.profile.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={ROLE_COLORS[m.role]}>{ROLE_LABELS[m.role]}</Badge>
                      <select
                        value={m.role}
                        onChange={(e) => handleRoleChange(m.id, e.target.value as MemberRole)}
                        className="rounded border border-input bg-background px-2 py-0.5 text-xs"
                      >
                        {(Object.keys(ROLE_LABELS) as MemberRole[]).map((r) => (
                          <option key={r} value={r}>
                            {ROLE_LABELS[r]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(m.created_at).toLocaleDateString("es-CL")}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleRemove(m.id, m.profile.email)}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label="Eliminar miembro"
                    >
                      <UserMinus className="h-4 w-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Invite form */}
      <div className="rounded-xl border border-border bg-background p-6">
        <h2 className="mb-4 text-sm font-semibold">Agregar miembro</h2>
        <form action={formAction} className="space-y-4">
          {state.message && state.message !== "ok" && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}
          {state.message === "ok" && (
            <p className="text-sm text-green-600">Miembro agregado.</p>
          )}

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="equipo@restaurante.com"
                className="mt-1"
              />
              {state.errors?.email && (
                <p className="mt-1 text-xs text-destructive">{state.errors.email[0]}</p>
              )}
            </div>
            <div>
              <Label htmlFor="role">Rol</Label>
              <select
                id="role"
                name="role"
                defaultValue="manager"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {(Object.keys(ROLE_LABELS) as MemberRole[]).map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABELS[r]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <InviteSubmitButton />
        </form>
      </div>
    </div>
  );
}

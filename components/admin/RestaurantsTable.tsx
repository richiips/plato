"use client";

import Link from "next/link";
import { useState } from "react";
import { ExternalLink, Settings, ChevronRight, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { togglePublished, deactivateRestaurant } from "@/lib/actions/restaurants";
import type { Restaurant } from "@/types/database";

interface RestaurantsTableProps {
  restaurants: Restaurant[];
}

export function RestaurantsTable({ restaurants: initialRestaurants }: RestaurantsTableProps) {
  const [restaurants, setRestaurants] = useState(initialRestaurants);
  const [optimisticPublished, setOptimisticPublished] = useState<Record<string, boolean>>({});
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const restaurantToDelete = restaurants.find((r) => r.id === confirmDeleteId);

  async function handleToggle(id: string, slug: string, current: boolean) {
    setOptimisticPublished((prev) => ({ ...prev, [id]: !current }));
    try {
      await togglePublished(id, !current);
      toast.success(!current ? `${slug} publicado` : `${slug} despublicado`);
    } catch {
      setOptimisticPublished((prev) => ({ ...prev, [id]: current }));
      toast.error("Error al cambiar estado");
    }
  }

  async function handleConfirmDelete() {
    if (!confirmDeleteId) return;
    setDeleting(true);
    try {
      await deactivateRestaurant(confirmDeleteId);
      setRestaurants((prev) => prev.filter((r) => r.id !== confirmDeleteId));
      toast.success("Restaurante eliminado");
    } catch {
      toast.error("Error al eliminar el restaurante");
    } finally {
      setDeleting(false);
      setConfirmDeleteId(null);
    }
  }

  if (restaurants.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border py-16 text-center text-muted-foreground">
        <p className="text-sm">No hay restaurantes aún.</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Publicado</TableHead>
              <TableHead>Carta</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {restaurants.map((r) => {
              const published = optimisticPublished[r.id] ?? r.is_published;
              return (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {r.slug}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={published}
                        onCheckedChange={() => handleToggle(r.id, r.slug, published)}
                      />
                      <Badge variant={published ? "default" : "secondary"}>
                        {published ? "Live" : "Draft"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/r/${r.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Ver carta
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/admin/restaurants/${r.id}`}
                        className="flex items-center text-muted-foreground hover:text-foreground"
                      >
                        <Settings className="h-4 w-4" />
                        <ChevronRight className="h-3 w-3" />
                      </Link>
                      <button
                        onClick={() => setConfirmDeleteId(r.id)}
                        className="ml-1 text-muted-foreground hover:text-destructive"
                        aria-label={`Eliminar ${r.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!confirmDeleteId} onOpenChange={(open) => !open && setConfirmDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar restaurante</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar{" "}
              <span className="font-semibold">{restaurantToDelete?.name}</span>? El restaurante
              quedará inactivo y su carta pública dejará de ser accesible. Esta acción se puede
              revertir desde la base de datos.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteId(null)} disabled={deleting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={deleting}>
              {deleting ? "Eliminando…" : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

import { notFound } from "next/navigation";
import { redirect } from "next/navigation";

export default async function RestaurantSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) notFound();
  redirect(`/admin/restaurants/${id}`);
}

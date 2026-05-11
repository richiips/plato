export default async function EditMenuItemPage({
  params,
}: {
  params: Promise<{ id: string; itemId: string }>;
}) {
  const { id, itemId } = await params;
  return <div data-id={id} data-item-id={itemId} />;
}

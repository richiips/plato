export default async function EditDashboardItemPage({
  params,
}: {
  params: Promise<{ itemId: string }>;
}) {
  const { itemId } = await params;
  return <div data-item-id={itemId} />;
}

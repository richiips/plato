export default async function NewMenuItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div data-id={id} />;
}

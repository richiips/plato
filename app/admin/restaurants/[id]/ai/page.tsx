export default async function AiConfigPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div data-id={id} />;
}

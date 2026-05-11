export const revalidate = 3600;

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string; catSlug: string }>;
}) {
  const { slug, catSlug } = await params;
  return <div data-slug={slug} data-cat-slug={catSlug} />;
}

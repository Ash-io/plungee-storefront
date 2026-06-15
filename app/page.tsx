import { api } from '@/lib/api';
import { resolveSlug } from '@/lib/store';
import { HomePageClient } from '@/components/HomePageClient';

export const revalidate = 60;

export default async function HomePage() {
  const slug = resolveSlug();
  const [productsRes, categories] = await Promise.all([
    api.products(slug, '?per_page=8'),
    api.categories(slug),
  ]);
  const products = productsRes?.data || [];
  const categoriesList = categories || [];

  return <HomePageClient initialProducts={products} initialCategories={categoriesList} />;
}

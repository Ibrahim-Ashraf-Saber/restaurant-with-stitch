import { Suspense } from 'react';
import { Container } from '@/components/shared/Container';
import { PageHeader } from '@/components/shared/PageHeader';
import { DishGrid } from '@/features/menu/DishGrid';
import { CategoriesFilter } from '@/features/menu/CategoriesFilter';
import { SearchFilter } from '@/features/menu/SearchFilter';
import { getCategories } from '@/sanity/queries/getCategories';
import { CardSkeleton } from '@/components/shared/SkeletonLoaders';

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const categories = await getCategories();
  const currentCategory = resolvedSearchParams.category || 'all';
  const searchQuery = resolvedSearchParams.q || '';

  return (
    <>
      <PageHeader 
        title="Our Menu" 
        subtitle="Explore our exquisite selection of culinary masterpieces, crafted with passion."
      />
      
      <Container className="py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <CategoriesFilter categories={categories} />
          <SearchFilter />
        </div>
        
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
               <CardSkeleton key={i} />
            ))}
          </div>
        }>
          <DishGrid categorySlug={currentCategory} searchQuery={searchQuery} />
        </Suspense>
      </Container>
    </>
  );
}

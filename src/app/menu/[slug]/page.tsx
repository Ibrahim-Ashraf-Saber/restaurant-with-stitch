import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Container } from '@/components/shared/Container';
import { DishDetails } from '@/features/dishes/DishDetails';
import { getDishBySlug } from '@/sanity/queries/getDishBySlug';
import { DishDetailsSkeleton } from '@/components/shared/SkeletonLoaders';

export default async function DishPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const dish = await getDishBySlug(resolvedParams.slug);

  if (!dish) {
    notFound();
  }

  return (
    <div className="pt-32 pb-24 bg-background min-h-screen">
      <Container>
        <Suspense fallback={<DishDetailsSkeleton />}>
          <DishDetails dish={dish} />
        </Suspense>
      </Container>
    </div>
  );
}

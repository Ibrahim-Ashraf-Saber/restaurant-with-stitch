import { Suspense } from 'react';
import { Hero } from '@/features/home/Hero';
import { FeaturedDishes } from '@/features/home/FeaturedDishes';
import { WhyChooseUs } from '@/features/home/WhyChooseUs';
import { Testimonials } from '@/features/home/Testimonials';
import { HeroSkeleton, CardSkeleton } from '@/components/shared/SkeletonLoaders';

export default function HomePage() {
  return (
    <>
      <Suspense fallback={<HeroSkeleton />}>
        <Hero />
      </Suspense>

      <Suspense fallback={
        <section className="py-24 px-4 max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </section>
      }>
        <FeaturedDishes />
      </Suspense>

      <Suspense fallback={null}>
        <WhyChooseUs />
      </Suspense>

      <Suspense fallback={null}>
        <Testimonials />
      </Suspense>
    </>
  );
}

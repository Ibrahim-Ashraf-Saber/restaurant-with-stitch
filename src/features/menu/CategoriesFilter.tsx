'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface CategoriesFilterProps {
  categories: { _id: string; name: string; slug: string }[];
}

export function CategoriesFilter({ categories }: CategoriesFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'all';

  const handleCategoryChange = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === 'all') {
      params.delete('category');
    } else {
      params.set('category', slug);
    }
    router.push(`/menu?${params.toString()}`);
  };

  return (
    <div className="flex overflow-x-auto pb-4 gap-2 mb-8 no-scrollbar">
      <Button
        variant={currentCategory === 'all' ? 'default' : 'outline'}
        onClick={() => handleCategoryChange('all')}
        className="rounded-full whitespace-nowrap"
      >
        All
      </Button>
      {categories.map((category) => (
        <Button
          key={category._id}
          variant={currentCategory === category.slug ? 'default' : 'outline'}
          onClick={() => handleCategoryChange(category.slug)}
          className="rounded-full whitespace-nowrap"
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
}

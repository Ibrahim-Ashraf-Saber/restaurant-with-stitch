import React from 'react';
import Link from 'next/link';
import { getAllDishes } from '@/sanity/queries/getAllDishes';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/EmptyState';
import Image from 'next/image';

interface Dish {
  _id: string;
  slug: string;
  name: string;
  price: number;
  shortDescription: string;
  categoryName?: string;
  imageUrl?: string;
}

interface DishGridProps {
  categorySlug?: string;
  searchQuery?: string;
}

export async function DishGrid({ categorySlug, searchQuery }: DishGridProps) {
  const dishes = await getAllDishes();

  let filteredDishes = dishes;

  if (categorySlug && categorySlug !== 'all') {
    filteredDishes = filteredDishes.filter((d: Dish) => d.slug.includes(categorySlug) || d.categoryName?.toLowerCase() === categorySlug.toLowerCase());
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filteredDishes = filteredDishes.filter(
      (d: Dish) => d.name.toLowerCase().includes(q) || d.shortDescription?.toLowerCase().includes(q)
    );
  }

  if (!filteredDishes || filteredDishes.length === 0) {
    return <EmptyState title="No dishes found" description="Try adjusting your filters or search query." />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredDishes.map((dish: Dish) => (
        <Card key={dish._id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group">
          <Link href={`/menu/${dish.slug}`} className="block relative h-48 overflow-hidden bg-muted">
            {dish.imageUrl ? (
              <Image 
                src={dish.imageUrl} 
                alt={dish.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
                <span className="font-medium text-lg text-primary/40">{dish.name}</span>
              </div>
            )}
          </Link>
          
          <div className="p-5 flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-foreground line-clamp-1">{dish.name}</h3>
              <span className="font-medium text-primary bg-primary/10 px-2 py-1 rounded-md text-sm whitespace-nowrap">
                ${dish.price.toFixed(2)}
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
              {dish.shortDescription}
            </p>
            
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
               <span className="bg-secondary/10 text-secondary-foreground font-medium text-xs px-2 py-1 rounded-full">
                {dish.categoryName || 'General'}
              </span>
              <Button size="sm" asChild>
                <Link href={`/menu/${dish.slug}`}>Details</Link>
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

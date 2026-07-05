'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, Clock, Flame, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/features/cart/cartStore';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DishDetails({ dish }: { dish: Record<string, any> }) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      id: dish._id,
      name: dish.name,
      price: dish.price,
      imageUrl: dish.imageGallery?.[0],
    });
    // Reset quantity after adding
    setQuantity(1);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
      {/* Image Gallery */}
      <div className="relative aspect-square md:aspect-[4/3] lg:aspect-square rounded-[32px] overflow-hidden bg-muted border border-border shadow-sm">
        {dish.imageGallery?.[0] ? (
          <Image 
            src={dish.imageGallery[0]} 
            alt={dish.name} 
            fill 
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
             <span className="font-medium text-2xl text-primary/30">{dish.name}</span>
          </div>
        )}
      </div>
      
      {/* Details */}
      <div className="flex flex-col h-full justify-center">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-primary/10 text-primary font-semibold text-sm px-3 py-1 rounded-full">
            {dish.categoryName || 'Special'}
          </span>
          {dish.featured && (
            <span className="bg-secondary/10 text-secondary-foreground font-semibold text-sm px-3 py-1 rounded-full">
              Chef&apos;s Choice
            </span>
          )}
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{dish.name}</h1>
        
        <div className="flex items-center gap-6 mb-8 text-sm font-medium text-muted-foreground">
          {dish.rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="text-foreground">{dish.rating} / 5</span>
            </div>
          )}
          {dish.preparationTime && (
            <div className="flex items-center gap-1">
              <Clock className="w-5 h-5 text-secondary" />
              <span>{dish.preparationTime} mins</span>
            </div>
          )}
          {dish.calories && (
            <div className="flex items-center gap-1">
              <Flame className="w-5 h-5 text-destructive" />
              <span>{dish.calories} kcal</span>
            </div>
          )}
        </div>
        
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          {dish.description || dish.shortDescription}
        </p>

        {dish.ingredients && dish.ingredients.length > 0 && (
          <div className="mb-10">
            <h3 className="text-lg font-semibold text-foreground mb-4">Ingredients</h3>
            <div className="flex flex-wrap gap-2">
              {dish.ingredients.map((ingredient: string, idx: number) => (
                <span key={idx} className="bg-surface-variant text-on-surface px-4 py-2 rounded-lg text-sm border border-outline-variant/30">
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-auto pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-4xl font-bold text-foreground">
            ${dish.price.toFixed(2)}
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {dish.available ? (
              <>
                <div className="flex items-center bg-muted rounded-xl p-1 border border-border">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-foreground hover:bg-background rounded-lg transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-foreground hover:bg-background rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                
                <Button 
                  size="lg" 
                  className="flex-1 sm:flex-none rounded-xl text-lg h-14 px-8 shadow-sm flex items-center gap-2"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag className="w-5 h-5" />
                  Add to Cart
                </Button>
              </>
            ) : (
              <Button size="lg" disabled className="w-full sm:w-auto rounded-xl h-14 px-8">
                Currently Unavailable
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

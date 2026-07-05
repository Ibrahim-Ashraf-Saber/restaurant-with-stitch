'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Minus, Plus, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/features/cart/cartStore';
import { Container } from '@/components/shared/Container';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/EmptyState';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotals } = useCartStore();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <>
        <PageHeader title="Your Cart" subtitle="Review your selected items before proceeding to checkout." />
        <Container className="py-24">
          <EmptyState 
            title="Your cart is empty" 
            description="Looks like you haven't added any dishes to your cart yet." 
            action={
              <Button asChild className="mt-4">
                <Link href="/menu">Explore Menu</Link>
              </Button>
            }
          />
        </Container>
      </>
    );
  }

  const { subtotal, taxes, total } = getTotals();

  return (
    <>
      <PageHeader title="Your Cart" subtitle="Review your selected items before proceeding to checkout." />
      <Container className="py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-6 p-6 bg-card rounded-2xl border border-border shadow-sm items-center">
                <div className="w-full sm:w-32 h-32 relative rounded-xl overflow-hidden bg-muted flex-shrink-0">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
                      <span className="font-medium text-sm text-primary/40">{item.name}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-foreground">{item.name}</h3>
                    <span className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center bg-muted rounded-lg p-1 border border-border">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 text-foreground hover:bg-background rounded-md transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 text-foreground hover:bg-background rounded-md transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-destructive flex items-center gap-1 text-sm font-medium transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card p-8 rounded-2xl border border-border shadow-sm sticky top-28">
              <h3 className="text-2xl font-semibold text-foreground mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery Fee</span>
                  <span className="text-foreground font-medium">$5.00</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Taxes (10%)</span>
                  <span className="text-foreground font-medium">${taxes.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="pt-6 border-t border-border mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-lg font-medium text-foreground">Grand Total</span>
                  <span className="text-3xl font-bold text-primary">${(total + 5).toFixed(2)}</span>
                </div>
              </div>
              
              <Button size="lg" className="w-full rounded-xl h-14 text-lg shadow-sm flex items-center justify-center gap-2">
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </Button>
              
              <div className="mt-4 text-center">
                <Link href="/menu" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

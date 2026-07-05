import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getHero } from '@/sanity/queries/getHero';
export async function Hero() {
  const heroData = await getHero();

  return (
    <section className="relative pt-[120px] pb-24 px-4 md:px-6 max-w-[1280px] mx-auto min-h-[80vh] flex items-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="z-10 max-w-2xl">
          <span className="inline-block py-1 px-4 bg-muted rounded-full text-primary font-medium text-sm mb-6 border border-border/30">
            SaaS-meets-Hospitality
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-[64px] font-bold text-foreground mb-6 leading-tight tracking-tight">
            {heroData?.heading || 'Exquisite Flavors,'} <br />
            <span className="text-primary">Unforgettable</span> Memories.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl">
            {heroData?.subheading || 'Experience the perfect blend of culinary mastery and seamless digital service. We bring the luxury of fine dining directly to your table, with precision and warmth.'}
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="rounded-xl font-semibold shadow-sm hover:scale-105 transition-transform duration-300" asChild>
              <Link href={(heroData?.ctaLink && heroData?.ctaText) ? heroData.ctaLink : "/menu"}>
                {(heroData?.ctaLink && heroData?.ctaText) ? heroData.ctaText : "Order Now"}
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-xl font-semibold bg-background" asChild>
              <Link href="/menu">View Menu</Link>
            </Button>
          </div>
        </div>
        
        {/* Image Container with Fixed Aspect Ratio */}
        <div className="relative aspect-square lg:aspect-[4/5] w-full rounded-3xl overflow-hidden shadow-xl bg-muted/50 border border-border flex items-center justify-center animate-in fade-in slide-in-from-right-8 duration-1000">
          {heroData?.heroImageUrl ? (
            <Image
              src={heroData.heroImageUrl}
              alt="Fine Dining Experience"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="text-center p-6 flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-muted/50 to-muted">
              <div className="w-24 h-24 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 text-primary shadow-sm border border-primary/10">
                <UtensilsCrossed className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Exquisite Dining</h3>
              <p className="text-sm text-muted-foreground max-w-[200px]">Experience culinary mastery at your table</p>
            </div>
          )}

          {/* Glassmorphism Badge */}
          <div className="absolute bottom-6 right-6 bg-white/80 dark:bg-black/80 backdrop-blur-md px-6 py-4 rounded-2xl shadow-lg border border-white/50 dark:border-white/10 flex items-center gap-4">
            <div className="bg-primary/10 text-primary p-2 rounded-full flex items-center justify-center">
              ⭐
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">Michelin Starred</p>
              <p className="text-xs text-muted-foreground">Executive Chef</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

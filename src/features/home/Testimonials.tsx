import React from 'react';
import { getTestimonials } from '@/sanity/queries/getTestimonials';
import { SectionTitle } from '@/components/shared/SectionTitle';
import Image from 'next/image';
import { Star } from 'lucide-react';

interface Testimonial {
  _id: string;
  rating: number;
  review: string;
  avatarUrl?: string;
  customerName: string;
  customerRole?: string;
}

export async function Testimonials() {
  const testimonials = await getTestimonials();

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-muted/30">
      <div className="px-4 md:px-6 max-w-[1280px] mx-auto">
        <SectionTitle 
          title="What Our Guests Say" 
          subtitle="Don't just take our word for it. Hear from those who have experienced the CulinaryPro standard."
          align="center"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {testimonials.map((testimonial: Testimonial) => (
            <div key={testimonial._id} className="bg-card p-8 rounded-[24px] shadow-sm border border-border/50 flex flex-col">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <p className="text-muted-foreground italic mb-8 flex-grow">&quot;{testimonial.review}&quot;</p>
              
              <div className="flex items-center gap-4 mt-auto pt-6 border-t border-border/50">
                {testimonial.avatarUrl ? (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image src={testimonial.avatarUrl} alt={testimonial.customerName} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                    {testimonial.customerName.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-foreground">{testimonial.customerName}</h4>
                  {testimonial.customerRole && <p className="text-sm text-muted-foreground">{testimonial.customerRole}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

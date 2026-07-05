import React from 'react';
import { getWhyChooseUs } from '@/sanity/queries/getWhyChooseUs';
import { SectionTitle } from '@/components/shared/SectionTitle';

// We use an icon map since material icons require the font, which we have not loaded.
// We can use lucide-react icons instead.
import * as LucideIcons from 'lucide-react';

interface Feature {
  _id: string;
  title: string;
  description: string;
  icon?: string;
}

export async function WhyChooseUs() {
  const features = await getWhyChooseUs();

  if (!features || features.length === 0) {
    return null; // Do not render if no features are set in Sanity
  }

  return (
    <section className="py-24 px-4 md:px-6 max-w-[1280px] mx-auto">
      <SectionTitle 
        title="The CulinaryPro Standard" 
        subtitle="We combine the rigorous standards of premium software with the artistry of fine dining."
        align="center"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
        {features.map((feature: Feature) => {
          // Attempt to dynamically load a Lucide icon, fallback to Star
          // Example material names 'local_florist', 'outdoor_grill', 'speed' mapped manually or vaguely
          let IconComponent = LucideIcons.Star;
          if (feature.icon?.includes('florist') || feature.icon?.includes('leaf')) IconComponent = LucideIcons.Leaf;
          if (feature.icon?.includes('grill') || feature.icon?.includes('chef')) IconComponent = LucideIcons.ChefHat;
          if (feature.icon?.includes('speed') || feature.icon?.includes('truck')) IconComponent = LucideIcons.Truck;

          return (
            <div key={feature._id} className="bg-card p-8 rounded-[24px] shadow-sm border border-border/50 text-center flex flex-col items-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
                 <IconComponent className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

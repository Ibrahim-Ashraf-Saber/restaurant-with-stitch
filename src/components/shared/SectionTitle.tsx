import React from 'react';
import { cn } from '@/lib/utils';

interface SectionTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
}

export function SectionTitle({ title, subtitle, align = 'left', className, ...props }: SectionTitleProps) {
  return (
    <div className={cn("mb-12", {
      'text-center': align === 'center',
      'text-right': align === 'right',
      'text-left': align === 'left',
    }, className)} {...props}>
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{title}</h2>
      {subtitle && <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>}
    </div>
  );
}

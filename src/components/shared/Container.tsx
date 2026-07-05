import React from 'react';
import { cn } from '@/lib/utils';

export function Container({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("max-w-[1280px] mx-auto px-4 md:px-6 w-full", className)} {...props}>
      {children}
    </div>
  );
}

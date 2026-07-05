import React from 'react';
import { Container } from './Container';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="bg-muted py-20 mt-[80px]">
      <Container>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{title}</h1>
        {subtitle && <p className="text-xl text-muted-foreground">{subtitle}</p>}
      </Container>
    </div>
  );
}

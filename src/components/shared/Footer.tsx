import React from 'react';
import Link from 'next/link';
import { Mail, Share2 } from 'lucide-react';
import { Container } from './Container';

export function Footer() {
  return (
    <footer className="bg-muted mt-24 border-t border-border">
      <Container className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="text-2xl font-bold text-primary mb-4 block">
              CulinaryPro
            </Link>
            <p className="text-sm text-muted-foreground mb-6 pr-4">
              Elevating the digital dining experience. Sophistication, precision, and unforgettable flavors delivered to your door.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:text-primary transition-colors shadow-sm">
                <Share2 className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:text-primary transition-colors shadow-sm">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Menu</h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li><Link href="/menu" className="text-muted-foreground hover:text-foreground transition-colors">Starters</Link></li>
              <li><Link href="/menu" className="text-muted-foreground hover:text-foreground transition-colors">Mains</Link></li>
              <li><Link href="/menu" className="text-muted-foreground hover:text-foreground transition-colors">Desserts</Link></li>
              <li><Link href="/menu" className="text-muted-foreground hover:text-foreground transition-colors">Beverages</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Careers</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Press</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Accessibility</Link></li>
            </ul>
          </div>
        </div>
      </Container>
      <div className="border-t border-border px-4 py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} CulinaryPro. All rights reserved.
      </div>
    </footer>
  );
}

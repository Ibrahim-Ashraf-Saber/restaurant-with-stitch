import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { getRestaurantSettings } from '@/sanity/queries/getRestaurantSettings';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getRestaurantSettings();
  
  return {
    title: settings?.name ? `${settings.name} - Exquisite Flavors` : 'CulinaryPro - Exquisite Flavors',
    description: settings?.footerText || 'Elevating the digital dining experience. Sophistication, precision, and unforgettable flavors delivered to your door.',
    openGraph: {
      title: settings?.name || 'CulinaryPro',
      description: 'Experience the perfect blend of culinary mastery and seamless digital service.',
    }
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-background text-foreground font-sans antialiased overflow-x-hidden min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

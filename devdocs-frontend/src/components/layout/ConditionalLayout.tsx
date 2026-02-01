/**
 * Conditional Layout Component
 * Conditionally renders Header/Footer based on current route
 */

'use client';

import { usePathname } from 'next/navigation';
import { Header, Footer } from '@/components/layout';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // Routes that should NOT show Header/Footer (they have their own glassmorphic navbar)
  const noLayoutRoutes = [
    '/', 
    '/auth/signin', 
    '/auth/signup', 
    '/dashboard',
    '/search',
    '/solution',
    '/profile',
  ];
  
  // Check if current path starts with any no-layout route
  const shouldHideLayout = noLayoutRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  // Routes with glassmorphic navbar (no header/footer needed)
  if (shouldHideLayout) {
    return <>{children}</>;
  }

  // Default layout (header + content + footer)
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

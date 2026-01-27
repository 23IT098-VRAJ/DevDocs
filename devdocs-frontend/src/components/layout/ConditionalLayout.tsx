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
  
  // Routes that should NOT show Header/Footer (landing page only)
  const noLayoutRoutes = ['/'];
  
  // Routes that should NOT show Header (auth pages, but still show footer)
  const noHeaderRoutes = ['/auth/signin', '/auth/signup', '/auth/forgot-password'];
  
  const shouldShowHeader = !noLayoutRoutes.includes(pathname) && !noHeaderRoutes.includes(pathname);
  const shouldShowFooter = !noLayoutRoutes.includes(pathname);

  // Landing page layout (no header/footer, they're built into the page)
  if (noLayoutRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  // Auth pages layout (no header, yes footer)
  if (noHeaderRoutes.includes(pathname)) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    );
  }

  // Default layout (header + content + footer)
  return (
    <div className="flex min-h-screen flex-col">
      {shouldShowHeader && <Header />}
      <main className="flex-1">
        {children}
      </main>
      {shouldShowFooter && <Footer />}
    </div>
  );
}

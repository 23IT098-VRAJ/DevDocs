import type { Metadata } from "next";
import { Manrope, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";

// Heading + UI font (h2–h6, buttons, nav)
const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-heading',
});

// Body + Caption font (paragraphs, descriptions, meta text)
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: "DevDocs - Your Personal AI-Powered Code Library",
  description: "Store, organize, and retrieve your code snippets instantly with semantic search.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${plusJakartaSans.variable}`}>
      <head>
        {/* Material Symbols */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        {/* Cabinet Grotesk (Display) — via Fontshare */}
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@800,700,500,400&display=swap" />
        {/* Cascadia Code (Mono) — via Fontsource CDN */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/cascadia-code/index.css" />
      </head>
      <body className="antialiased">
        <ErrorBoundary>
          <AuthProvider>
            <QueryProvider>
              <ThemeProvider>
                <ConditionalLayout>
                  <PageTransition>{children}</PageTransition>
                </ConditionalLayout>
              </ThemeProvider>
            </QueryProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

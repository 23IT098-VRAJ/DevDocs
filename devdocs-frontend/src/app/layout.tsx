import type { Metadata } from "next";
import { Exo_2 } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";

const exo2 = Exo_2({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-sans',
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
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      <body className={`${exo2.className} antialiased`}>
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

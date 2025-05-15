
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import { AuthProvider } from '@/context/AuthContext'; // Import AuthProvider

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'StreamZone',
  description: 'Your ultimate hub for movies and TV shows.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning={true}>
      <body className={cn(geistSans.variable, geistMono.variable, "antialiased min-h-screen flex flex-col")}>
        <AuthProvider> {/* Wrap with AuthProvider */}
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <footer className="py-6 text-center text-xs text-muted-foreground border-t border-border/50">
            © {new Date().getFullYear()} StreamZone. All rights reserved.
          </footer>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

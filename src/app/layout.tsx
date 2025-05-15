import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Game Zone',
  description: 'Your ultimate destination for games and recommendations.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(geistSans.variable, geistMono.variable, "antialiased min-h-screen flex flex-col")}>
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="py-6 text-center text-muted-foreground border-t">
          © {new Date().getFullYear()} Game Zone. All rights reserved.
        </footer>
        <Toaster />
      </body>
    </html>
  );
}

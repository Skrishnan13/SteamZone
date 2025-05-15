import Link from 'next/link';
import { Gamepad } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary hover:text-accent transition-colors">
          <Gamepad className="h-7 w-7" />
          <span>Game Zone</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" asChild>
            <Link href="/">Directory</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/recommendations">AI Recommendations</Link>
          </Button>
          {/* Future User Auth Button
          <Button variant="outline" size="sm">
            Sign In
          </Button>
          */}
        </nav>
      </div>
    </header>
  );
}

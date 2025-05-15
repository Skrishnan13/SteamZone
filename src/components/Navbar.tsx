import Link from 'next/link';
import { Clapperboard, Search, Bell, UserCircle } from 'lucide-react'; // Using Clapperboard for a video/movie theme
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Navbar() {
  return (
    <header className="bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
            <Clapperboard className="h-8 w-8" />
            <span>StreamZone</span>
          </Link>
          <nav className="hidden md:flex items-center gap-3">
            <Button variant="ghost" asChild className="text-sm text-foreground/90 hover:text-foreground">
              <Link href="/">Home</Link>
            </Button>
            <Button variant="ghost" asChild className="text-sm text-foreground/90 hover:text-foreground">
              <Link href="/browse/tv">TV Shows</Link>
            </Button>
            <Button variant="ghost" asChild className="text-sm text-foreground/90 hover:text-foreground">
              <Link href="/browse/movies">Movies</Link>
            </Button>
            <Button variant="ghost" asChild className="text-sm text-foreground/90 hover:text-foreground">
              <Link href="/latest">New & Popular</Link>
            </Button>
             <Button variant="ghost" asChild className="text-sm text-foreground/90 hover:text-foreground">
              <Link href="/admin">Admin</Link>
            </Button>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-foreground/90 hover:text-foreground">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-foreground/90 hover:text-foreground">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-foreground/90 hover:text-foreground">
            <UserCircle className="h-6 w-6" />
            <span className="sr-only">Profile</span>
          </Button>
          {/* Mobile Menu Trigger - to be implemented later */}
          {/* <Button variant="ghost" size="icon" className="md:hidden text-foreground/90 hover:text-foreground">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Menu</span>
          </Button> */}
        </div>
      </div>
    </header>
  );
}

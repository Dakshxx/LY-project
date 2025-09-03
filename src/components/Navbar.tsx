import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Newspaper, Upload, Bookmark, Home, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/upload', label: 'Upload News', icon: Upload },
  { path: '/saved', label: 'Saved Articles', icon: Bookmark },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ to, children, mobile = false }: { to: string; children: React.ReactNode; mobile?: boolean }) => (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
        isActive(to)
          ? 'bg-primary text-primary-foreground shadow-button'
          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
      } ${mobile ? 'w-full' : ''}`}
      onClick={() => mobile && setIsOpen(false)}
    >
      {children}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <Newspaper className="h-6 w-6" />
            NewsHub
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex items-center justify-between mb-8">
                <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                  <Newspaper className="h-6 w-6" />
                  NewsHub
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <NavLink key={item.path} to={item.path} mobile>
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Video, Library, Sparkles, User, Zap } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Create', icon: Video, href: '/dashboard' },
    { label: 'Library', icon: Library, href: '/dashboard/library' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full glass-morphism border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <span className="font-headline font-bold text-xl tracking-tight hidden sm:inline-block">
              OmniVid <span className="gradient-text">AI</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "gap-2 px-4",
                    pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="hidden sm:flex gap-2 border-primary/30 text-primary hover:bg-primary/5">
            <Zap className="w-4 h-4 fill-primary" />
            Standard Mode
          </Button>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 cursor-pointer">
            <img 
              src="https://picsum.photos/seed/user-nav/100/100" 
              alt="User" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

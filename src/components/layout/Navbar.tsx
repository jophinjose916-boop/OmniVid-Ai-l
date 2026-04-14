
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Video, Library, Sparkles, User, Zap, LogIn } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUser, useAuth, useFirestore, initiateGoogleSignIn, setDocumentNonBlocking } from '@/firebase';
import { useEffect } from 'react';
import { doc } from 'firebase/firestore';

export function Navbar() {
  const pathname = usePathname();
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();

  const navItems = [
    { label: 'Create', icon: Video, href: '/dashboard' },
    { label: 'Library', icon: Library, href: '/dashboard/library' },
  ];

  // Sync user profile to Firestore if signed in via Google
  useEffect(() => {
    if (user && !user.isAnonymous && db) {
      const userRef = doc(db, 'users', user.uid);
      setDocumentNonBlocking(userRef, {
        id: user.uid,
        googleId: user.providerData[0]?.uid || user.uid,
        email: user.email,
        lastLoginAt: new Date().toISOString(),
        // Only set createdAt if it doesn't exist (handled by merge strategy if we add logic, 
        // but for now simple merge is fine for MVP)
        createdAt: new Date().toISOString(), 
      }, { merge: true });
    }
  }, [user, db]);

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

          {user && !user.isAnonymous ? (
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 ring-2 ring-primary/20">
              <img 
                src={user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`} 
                alt={user.displayName || "User"} 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <Button 
              variant="secondary" 
              size="sm" 
              className="gap-2 font-bold"
              onClick={() => auth && initiateGoogleSignIn(auth)}
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}

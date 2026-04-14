"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Video, Library, Sparkles, User, Zap, LogIn, Fingerprint, Mail, ShieldCheck } from 'lucide-react';
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

  // Sync user profile to Firestore if signed in via Google
  useEffect(() => {
    if (user && !user.isAnonymous && db) {
      const userRef = doc(db, 'users', user.uid);
      setDocumentNonBlocking(userRef, {
        id: user.uid,
        googleId: user.providerData[0]?.uid || user.uid,
        email: user.email,
        lastLoginAt: new Date().toISOString(),
        createdAt: new Date().toISOString(), 
      }, { merge: true });
    }
  }, [user, db]);

  const navItems = [
    { label: '4K Create', icon: Video, href: '/dashboard' },
    { label: 'Library', icon: Library, href: '/dashboard/library' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full glass-morphism border-b border-white/5 h-20 flex items-center">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <span className="font-headline font-bold text-2xl tracking-tighter hidden sm:inline-block">
              OmniVid <span className="gradient-text">AI</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "gap-2 px-6 h-11 text-sm font-bold uppercase tracking-widest rounded-xl transition-all",
                    pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-white/5"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="hidden sm:flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-xl border border-secondary/20">
            <Fingerprint className="w-4 h-4 text-secondary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-secondary">Biometric Tech Active</span>
          </div>

          {user && !user.isAnonymous ? (
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-green-500 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Secure Session
                </span>
                <span className="text-[11px] font-bold text-muted-foreground">{user.email}</span>
              </div>
              <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-primary/30 ring-4 ring-primary/10 shadow-xl">
                <img 
                  src={user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`} 
                  alt={user.displayName || "User"} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ) : (
            <Button 
              variant="secondary" 
              className="gap-3 font-black uppercase tracking-widest gradient-bg text-white border-none h-12 px-8 rounded-2xl shadow-2xl hover:scale-105 transition-all"
              onClick={() => auth && initiateGoogleSignIn(auth)}
            >
              <Mail className="w-5 h-5" />
              Log Gmail
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}

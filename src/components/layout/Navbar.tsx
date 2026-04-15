
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Video, Library, User, Zap, LogIn, Fingerprint, Mail, ShieldCheck, Loader2, Key } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUser, useAuth, useFirestore, initiateGoogleSignIn, initiateEmailSignIn, initiateEmailSignUp, setDocumentNonBlocking } from '@/firebase';
import { useEffect, useState } from 'react';
import { doc } from 'firebase/firestore';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export function Navbar() {
  const pathname = usePathname();
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const appLogo = PlaceHolderImages.find(img => img.id === 'app-logo');
  const [isSigningIn, setIsSigningIn] = useState(false);
  
  // Email/Password state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Sync user profile to Firestore if signed in
  useEffect(() => {
    if (user && !user.isAnonymous && db) {
      const userRef = doc(db, 'users', user.uid);
      setDocumentNonBlocking(userRef, {
        id: user.uid,
        googleId: user.providerData[0]?.providerId === 'google.com' ? user.providerData[0]?.uid : null,
        email: user.email,
        lastLoginAt: new Date().toISOString(),
        createdAt: new Date().toISOString(), 
      }, { merge: true });
    }
  }, [user, db]);

  const handleGoogleSignIn = () => {
    if (!auth || isSigningIn) return;
    setIsSigningIn(true);
    initiateGoogleSignIn(auth)
      .then(() => {
        setIsSigningIn(false);
        setIsDialogOpen(false);
        toast({ title: "Welcome back!", description: "Successfully signed in with Google." });
      })
      .catch((error) => {
        setIsSigningIn(false);
        const ignoredErrors = ['auth/popup-closed-by-user', 'auth/cancelled-popup-request'];
        if (!ignoredErrors.includes(error.code)) {
          toast({
            variant: "destructive",
            title: "Sign-in Failed",
            description: error.message || "Could not complete Google authentication."
          });
        }
      });
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !email || !password || isSigningIn) return;
    setIsSigningIn(true);
    
    const authPromise = isSignUp 
      ? initiateEmailSignUp(auth, email, password)
      : initiateEmailSignIn(auth, email, password);
    
    authPromise
      .then(() => {
        setIsSigningIn(false);
        setIsDialogOpen(false);
        toast({ 
          title: isSignUp ? "Account Created" : "Welcome back", 
          description: isSignUp ? "Your secure session is now active." : "Successfully logged in." 
        });
      })
      .catch((error) => {
        setIsSigningIn(false);
        let errorMessage = "Invalid credentials. Please check your email and password.";
        
        if (error.code === 'auth/email-already-in-use') errorMessage = "This email is already registered.";
        if (error.code === 'auth/weak-password') errorMessage = "Password should be at least 6 characters.";
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
          errorMessage = "Incorrect email or password.";
        }

        toast({
          variant: "destructive",
          title: "Authentication Failed",
          description: errorMessage
        });
      });
  };

  const navItems = [
    { label: '4K Create', icon: Video, href: '/dashboard' },
    { label: 'Library', icon: Library, href: '/dashboard/library' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full glass-morphism border-b border-white/5 h-20 flex items-center">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg group-hover:scale-110 transition-transform">
              <img 
                src={appLogo?.imageUrl} 
                alt="OmniVid AI Logo" 
                className="w-full h-full object-cover"
                data-ai-hint={appLogo?.imageHint}
              />
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
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="secondary" 
                  className="gap-3 font-black uppercase tracking-widest gradient-bg text-white border-none h-12 px-8 rounded-2xl shadow-2xl hover:scale-105 transition-all"
                >
                  <Mail className="w-5 h-5" />
                  Log Gmail / Email
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[400px] bg-card border-white/10 rounded-3xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-headline font-bold text-center mb-6">Secure Session Access</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <Button 
                    className="w-full h-14 font-bold uppercase tracking-widest gap-3 rounded-2xl border-white/10 hover:bg-white/5 transition-all"
                    variant="outline"
                    onClick={handleGoogleSignIn}
                    disabled={isSigningIn}
                  >
                    {isSigningIn ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5 text-primary" />}
                    Log Gmail
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground font-bold tracking-widest">Or secure email</span>
                    </div>
                  </div>

                  <form onSubmit={handleEmailAuth} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest opacity-60 ml-1">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="name@example.com" 
                        className="bg-background/50 border-white/10 h-12 rounded-xl focus:ring-primary"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-widest opacity-60 ml-1">Password</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        className="bg-background/50 border-white/10 h-12 rounded-xl focus:ring-primary"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-14 gradient-bg text-white font-bold uppercase tracking-widest rounded-2xl shadow-xl hover:scale-[1.02] transition-all"
                      disabled={isSigningIn}
                    >
                      {isSigningIn ? <Loader2 className="w-5 h-5 animate-spin" /> : <Key className="w-5 h-5" />}
                      {isSignUp ? "Create Account" : "Secure Login"}
                    </Button>
                  </form>

                  <div className="text-center">
                    <button 
                      className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline"
                      onClick={() => setIsSignUp(!isSignUp)}
                    >
                      {isSignUp ? "Already have a session? Log in" : "New user? Create biometric account"}
                    </button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </nav>
  );
}

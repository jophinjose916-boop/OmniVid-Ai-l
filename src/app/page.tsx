
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, Globe2, ShieldCheck, Zap, ArrowRight, Video, Play } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 gradient-bg blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 gradient-bg blur-[120px] rounded-full opacity-60"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-morphism border-primary/20 text-primary text-sm font-medium animate-in fade-in slide-in-from-top-4 duration-700">
              <Sparkles className="w-4 h-4 fill-primary" />
              Revolutionizing Video Creation
            </div>
            
            <h1 className="text-5xl md:text-7xl font-headline font-bold leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              Unlimited AI Video for <span className="gradient-text">Everyone</span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              Create stunning cinematic videos from text in over 100 languages. 
              No credits, no limits, just your imagination.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <Link href="/dashboard">
                <Button size="lg" className="gradient-bg text-white h-14 px-10 text-lg font-headline font-bold gap-2">
                  Start Creating Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-headline font-bold border-white/10 hover:bg-white/5">
                Watch Demo
              </Button>
            </div>
            
            <div className="w-full max-w-5xl pt-16 animate-in fade-in zoom-in-95 duration-1000 delay-500">
              <div className="aspect-video relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group cursor-pointer">
                <img 
                  src="https://picsum.photos/seed/omni-landing/1280/720" 
                  alt="Product UI Preview" 
                  className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Play className="text-white fill-white w-8 h-8 ml-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-card/30 border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4 text-center md:text-left">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto md:mx-0">
                <Globe2 className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-xl font-headline font-bold">100+ Languages</h3>
              <p className="text-muted-foreground">Type prompts in your native language. Our AI translates and optimizes for the best results.</p>
            </div>
            <div className="space-y-4 text-center md:text-left">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mx-auto md:mx-0">
                <Zap className="text-secondary w-6 h-6" />
              </div>
              <h3 className="text-xl font-headline font-bold">Unlimited Free</h3>
              <p className="text-muted-foreground">Standard 720p generation is free forever. Use the ad-supported queue for priority access.</p>
            </div>
            <div className="space-y-4 text-center md:text-left">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto md:mx-0">
                <ShieldCheck className="text-green-500 w-6 h-6" />
              </div>
              <h3 className="text-xl font-headline font-bold">Secure by Design</h3>
              <p className="text-muted-foreground">One-tap Google login. No passwords. Your prompts and videos are encrypted at rest.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <Video className="text-white w-4 h-4" />
            </div>
            <span className="font-headline font-bold text-lg">OmniVid AI</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 OmniVid AI. Powered by Google Veo.</p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="#" className="hover:text-primary transition-colors">Safety</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

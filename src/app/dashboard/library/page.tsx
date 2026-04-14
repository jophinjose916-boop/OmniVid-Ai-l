
"use client";

import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Share2, MoreVertical, Play, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import Link from 'next/link';

export default function LibraryPage() {
  const { user, isUserLoading: isAuthLoading } = useUser();
  const db = useFirestore();

  const videosQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'users', user.uid, 'videos'),
      orderBy('createdAt', 'desc')
    );
  }, [db, user]);

  const { data: videos, isLoading } = useCollection(videosQuery);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h1 className="text-4xl font-headline font-bold mb-2">My Library</h1>
            <p className="text-muted-foreground">Your recent creations and generated videos.</p>
          </div>
          <Link href="/dashboard">
            <Button className="gradient-bg font-headline font-bold">New Creation</Button>
          </Link>
        </div>

        {isAuthLoading || isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading your library...</p>
          </div>
        ) : !videos || videos.length === 0 ? (
          <div className="text-center py-20 border rounded-2xl border-dashed border-white/10 bg-card/30">
            <Play className="w-12 h-12 mx-auto text-muted-foreground opacity-20 mb-4" />
            <h3 className="text-xl font-headline font-bold mb-2">No videos yet</h3>
            <p className="text-muted-foreground mb-6">Start your first creation to see it here.</p>
            <Link href="/dashboard">
              <Button variant="outline">Go to Dashboard</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
              <Card key={video.id} className="group relative overflow-hidden bg-card/50 border-white/10 hover:border-primary/50 transition-all duration-300">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={video.thumbnailUrl || 'https://picsum.photos/seed/placeholder/600/400'} 
                    alt={video.originalPrompt} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Link href={video.storageUrl} target="_blank">
                      <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
                        <Play className="w-6 h-6 fill-white ml-1" />
                      </div>
                    </Link>
                  </div>
                </div>
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <p className="font-medium line-clamp-2 text-sm leading-snug">{video.originalPrompt}</p>
                    <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(video.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-3">
                      <a href={video.storageUrl} download className="hover:text-primary transition-colors flex items-center gap-1">
                        <Download className="w-3.5 h-3.5" />
                        Save
                      </a>
                      <button className="hover:text-primary transition-colors flex items-center gap-1">
                        <Share2 className="w-3.5 h-3.5" />
                        Share
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

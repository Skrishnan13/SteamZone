
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { currentUser, isLoading: authIsLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authIsLoading) { // Only check/redirect once auth state is resolved
      if (!currentUser || currentUser.username !== 'admin') {
        router.replace('/login');
      }
    }
  }, [currentUser, authIsLoading, router]);

  if (authIsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-1/3 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-10 w-full mt-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // If still loading or not the admin, the effect would have redirected.
  // However, to prevent rendering children before redirect, we can double check.
  if (!currentUser || currentUser.username !== 'admin') {
    // This state should ideally be brief or not reached if redirect is fast.
    // Can return null or a more specific "Access Denied" or redirecting message if needed.
    return null; 
  }

  return <>{children}</>;
}

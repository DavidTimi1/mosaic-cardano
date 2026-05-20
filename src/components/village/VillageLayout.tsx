"use client";
import React, { useEffect, useState } from 'react';
import VillageSidebar from './VillageSidebar';
import VillageTopAppBar from './VillageTopAppBar';
import { cn } from '@/lib/utils';
import { useParams } from 'next/navigation';
import { useGetAuthState, useGetVillageMembership } from '@/services/auth';

export default function VillageLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Sync with sidebar state to adjust margin
    const checkState = () => {
      const storedState = localStorage.getItem('mosaic_village_sidebar_collapsed');
      if (storedState) setIsCollapsed(JSON.parse(storedState));
    };
    checkState();
    
    // Poll or listen for changes if necessary, but initial load is usually fine
    window.addEventListener('storage', checkState);
    return () => window.removeEventListener('storage', checkState);
  }, []);

  const params = useParams();
  const communityId = params.community_id as string;
  const { data: authState } = useGetAuthState();
  const { data: membership } = useGetVillageMembership(communityId);

  const showSidebar = authState?.isAuthenticated && membership?.isMember;

  if (!mounted) return <div className="min-h-screen bg-theme-surface" />;

  return (
    <div className="h-screen flex flex-col bg-theme-surface text-theme-forest font-sans overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]" style={{ backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuC9QuQNM5A8ulD-usGL7WPxprHWmeC1zp2nhD8CF6pluhdSTFuGFuDybp4W_4FJrvqFXLHILme-ekFljqjyy1t27hqsnYO2PUlSGsXUH1BfWcy0l0MKNAy2jiO3HvfNGyioojpRvp8bVSINIT5kfC9L4YKawElG2iVn_euP7Vj-dA-gIgOS9mvtepudjtKzCEPea5dqpIe5HBeRa1_s6b3zisR-w8wf7EZ1vl74rUcdHioIx5gkTk5zqs3kBht290neCZWMfeVva1U)' }} />

      <div className='size-full flex overflow-y-hidden'>
        {showSidebar && <VillageSidebar />}
        <main className={cn(
          "flex-1 flex flex-col transition-all duration-300 overflow-y-auto w-full", 
          showSidebar ? (isCollapsed ? "ml-20" : "ml-64") : "ml-0"
        )}>
          <VillageTopAppBar />
          {children}
        </main>
      </div>
    </div>
  );
}

"use client";
import React from 'react';
import Link from 'next/link';
import { useGetCommunityUpdates } from '@/services/home';
import { Landmark, MessageSquare, Scale } from 'lucide-react';
import { StatePanel } from '@/components/ui/StatePanel';

export default function CommunityUpdates() {
  const { data: updates, isLoading, isError, error, refetch } = useGetCommunityUpdates();

  const getIcon = (type: string) => {
    switch (type) {
      case 'governance': return <Scale size={18} className="text-theme-clay" />;
      case 'treasury': return <Landmark size={18} className="text-theme-clay" />;
      case 'discussion': return <MessageSquare size={18} className="text-theme-clay" />;
      default: return <MessageSquare size={18} className="text-theme-clay" />;
    }
  };

  return (
    <div>
      <h3 className="font-serif text-xl font-medium mb-6 pb-2 border-b border-theme-outline/30">Community Bulletins</h3>
      <div className="space-y-4">
        {isLoading ? (
          <StatePanel variant="loading" title="Loading community bulletins" description="We are checking for the latest governance, treasury, and discussion updates." />
        ) : isError ? (
          <StatePanel
            variant="error"
            title="Could not load community bulletins"
            description="Something went wrong while fetching community updates."
            errorMessage={error instanceof Error ? error.message : 'Failed to load community updates.'}
            onRetry={() => void refetch()}
          />
        ) : updates && updates.length > 0 ? (
          updates.map((update) => (
            <Link href={update.link} key={update.id} className="block">
              <div className="p-4 bg-theme-surface-low border border-theme-outline/30 rounded-lg flex items-start gap-4 hover:border-theme-clay transition-colors cursor-pointer group">
                <div className="mt-1 bg-theme-surface p-2 rounded-full border border-theme-outline/20">
                  {getIcon(update.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-baseline mb-1">
                    <p className="font-sans text-[10px] uppercase tracking-widest text-theme-on-surface/60">{update.community}</p>
                    <p className="font-mono text-[10px] text-theme-on-surface/50">{update.timestamp}</p>
                  </div>
                  <h4 className="font-bold text-sm text-theme-forest mb-1 group-hover:text-theme-accent transition-colors">{update.title}</h4>
                  <p className="text-xs text-theme-on-surface/80 leading-relaxed mb-2">{update.description}</p>
                  <span className="inline-block bg-theme-outline/10 px-2 py-0.5 rounded text-[10px] uppercase font-sans tracking-widest text-theme-forest font-semibold">
                    {update.status}
                  </span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <StatePanel
            variant="empty"
            title="No community bulletins yet"
            description="Updates from the communities you belong to will appear here when activity picks up."
          />
        )}
      </div>
    </div>
  );
}

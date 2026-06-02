"use client";
import React from 'react';
import Link from 'next/link';
import { useGetSavedItems } from '@/services/home';
import { Bookmark } from 'lucide-react';
import { StatePanel } from '@/components/ui/StatePanel';

export default function SavedItems() {
  const { data: saved, isLoading, isError, error, refetch } = useGetSavedItems();

  if (isLoading) {
    return (
      <StatePanel
        variant="loading"
        title="Loading saved items"
        description="We are checking the items you have saved for later."
      />
    );
  }

  if (isError) {
    return (
      <StatePanel
        variant="error"
        title="Could not load saved items"
        description="Something went wrong while loading your saved links."
        errorMessage={error instanceof Error ? error.message : 'Failed to load saved items.'}
        onRetry={() => void refetch()}
      />
    );
  }

  if (!saved || saved.length === 0) {
    return (
      <StatePanel
        variant="empty"
        title="No saved items yet"
        description="Save publications, drafts, and links here so you can return to them later."
        hasAction
        actionLabel="Browse Library"
        onTriggerAction={() => { window.location.href = '/library'; }}
      />
    );
  }

  return (
    <div className="bg-theme-surface-high p-6 rounded-lg border border-theme-outline/40">
      <div className="flex items-center gap-2 mb-4">
        <Bookmark className="text-theme-accent" size={20} />
        <h3 className="font-serif text-xl font-medium">Saved Links</h3>
      </div>
      
      <div className="space-y-4">
        {saved.map((item) => (
          <Link href={item.link} key={item.id} className="block">
            <div className="p-3 bg-theme-parchment border border-theme-outline/30 rounded group cursor-pointer hover:border-theme-clay transition-all">
              <h4 className="font-medium text-theme-forest text-sm mb-1 leading-tight group-hover:text-theme-accent transition-colors">{item.title}</h4>
              <p className="text-[10px] font-sans uppercase tracking-widest text-theme-on-surface/60">{item.type} • {item.author}</p>
            </div>
          </Link>
        ))}
      </div>
      <Link href="/library" className="block w-full text-center mt-4 text-[10px] font-sans uppercase tracking-widest text-theme-on-surface/60 hover:text-theme-accent transition-colors">
        View All Library
      </Link>
    </div>
  );
}

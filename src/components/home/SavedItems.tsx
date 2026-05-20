"use client";
import React from 'react';
import Link from 'next/link';
import { useGetSavedItems } from '@/services/home';
import { Bookmark } from 'lucide-react';

export default function SavedItems() {
  const { data: saved, isLoading } = useGetSavedItems();

  return (
    <div className="bg-theme-surface-high p-6 rounded-lg border border-theme-outline/40">
      <div className="flex items-center gap-2 mb-4">
        <Bookmark className="text-theme-accent" size={20} />
        <h3 className="font-serif text-xl font-medium">Saved Links</h3>
      </div>
      
      <div className="space-y-4">
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-12 bg-theme-parchment rounded border border-theme-outline/20"></div>
            <div className="h-12 bg-theme-parchment rounded border border-theme-outline/20"></div>
          </div>
        ) : (
          saved?.map((item) => (
            <Link href={item.link} key={item.id} className="block">
              <div className="p-3 bg-theme-parchment border border-theme-outline/30 rounded group cursor-pointer hover:border-theme-clay transition-all">
                <h4 className="font-medium text-theme-forest text-sm mb-1 leading-tight group-hover:text-theme-accent transition-colors">{item.title}</h4>
                <p className="text-[10px] font-sans uppercase tracking-widest text-theme-on-surface/60">{item.type} • {item.author}</p>
              </div>
            </Link>
          ))
        )}
      </div>
      <Link href="/library" className="block w-full text-center mt-4 text-[10px] font-sans uppercase tracking-widest text-theme-on-surface/60 hover:text-theme-accent transition-colors">
        View All Library
      </Link>
    </div>
  );
}

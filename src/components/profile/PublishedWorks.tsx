import React from 'react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { TexturedCard } from '../ui/textured-card';
import type { PublishedWork } from '../../services/users';

export const PublishedWorks = ({ works, isLoading }: { works?: PublishedWork[], isLoading: boolean }) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-theme-surface-high animate-pulse rounded mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <div key={i} className="h-40 w-full bg-theme-surface-high animate-pulse rounded-2xl border border-theme-outline/10" />
          ))}
        </div>
      </div>
    );
  }

  if (!works || works.length === 0) return null;

  return (
    <div className="space-y-8">
      <h3 className="font-serif text-3xl text-theme-forest border-b border-theme-outline/10 pb-4">Published Works</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {works.map((work, i) => (
          <Link href={`/artifact/${work.id}`} key={work.id} className="block group h-full">
            <TexturedCard 
              patternId={((i % 5) + 1) as 1 | 2 | 3 | 4 | 5}
              patternColor="text-theme-clay"
              patternOpacity="opacity-40 group-hover:opacity-60 transition-opacity duration-500"
              className="bg-theme-surface-high border border-theme-outline/20 rounded-2xl p-6 hover:border-theme-clay/50 hover:-translate-y-1 transition-all shadow-sm hover:shadow-md h-full flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <BookOpen size={24} className="text-theme-clay opacity-70" />
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-1 bg-theme-surface rounded border border-theme-outline/10 text-theme-on-surface/60">
                  {work.type}
                </span>
              </div>
              
              <h4 className="font-serif text-xl mb-2 group-hover:text-theme-clay transition-colors">{work.title}</h4>
              
              <div className="mt-auto pt-6 flex items-center justify-between text-xs font-sans text-theme-on-surface/50 uppercase tracking-widest">
                <span>{work.community}</span>
                <span>{work.date}</span>
              </div>
            </TexturedCard>
          </Link>
        ))}
      </div>
    </div>
  );
};

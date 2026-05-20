import React from 'react';
import { HammerIcon } from 'lucide-react';

export default function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center min-h-[calc(100vh-64px)]">
      <div className="w-20 h-20 bg-theme-surface-high rounded-full flex items-center justify-center mb-6 border border-theme-outline/20 shadow-sm">
        <HammerIcon className="text-theme-accent" size={32} />
      </div>
      <h1 className="font-serif text-3xl font-medium text-theme-forest mb-2">{title}</h1>
      <p className="text-theme-on-surface/60 max-w-md font-sans leading-relaxed">
        The artisans of Mosaic are currently sculpting this space.
        Check back soon to explore the new features.
      </p>
    </div>
  );
}

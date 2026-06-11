import React from 'react';
import { cn } from '@/lib/utils';

export type EntityType = 'village' | 'project' | 'piece' | 'publication';

interface Props {
  type: EntityType;
  className?: string;
}

export function EntityPlaceholder({ type, className }: Props) {
  const baseClasses = "w-full h-full flex items-center justify-center p-2";

  switch (type) {
    case 'village':
      // Overlapping interconnected circles
      return (
        <svg viewBox="0 0 100 100" className={cn(baseClasses, className)} fill="none" stroke="currentColor" strokeWidth="4">
          <circle cx="40" cy="40" r="25" className="text-theme-accent/70" fill="currentColor" fillOpacity="0.2" />
          <circle cx="60" cy="40" r="25" className="text-indigo-500/70" fill="currentColor" fillOpacity="0.2" />
          <circle cx="50" cy="60" r="25" className="text-emerald-500/70" fill="currentColor" fillOpacity="0.2" />
        </svg>
      );
    case 'project':
      // Interlocking scaffolding/stepping stones
      return (
        <svg viewBox="0 0 100 100" className={cn(baseClasses, className)} fill="none" stroke="currentColor" strokeWidth="6" strokeLinejoin="round">
          <rect x="20" y="20" width="30" height="30" className="text-theme-accent/60" />
          <rect x="50" y="50" width="30" height="30" className="text-indigo-500/60" />
          <path d="M 50 20 L 80 20 L 80 50" className="text-emerald-500/60" />
          <path d="M 20 50 L 20 80 L 50 80" className="text-theme-accent/60" />
        </svg>
      );
    case 'piece':
      // Layered geometric sheets
      return (
        <svg viewBox="0 0 100 100" className={cn(baseClasses, className)} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
          <rect x="30" y="20" width="50" height="60" rx="4" className="text-theme-accent/40" />
          <rect x="20" y="30" width="50" height="60" rx="4" className="text-indigo-500/60" fill="currentColor" fillOpacity="0.1" />
          <line x1="35" y1="50" x2="55" y2="50" className="text-indigo-500/60" />
          <line x1="35" y1="65" x2="45" y2="65" className="text-indigo-500/60" />
        </svg>
      );
    case 'publication':
      // Bounded, complete prism/book structure
      return (
        <svg viewBox="0 0 100 100" className={cn(baseClasses, className)} fill="none" stroke="currentColor" strokeWidth="5" strokeLinejoin="round">
          <path d="M 50 20 L 85 35 L 85 75 L 50 90 L 15 75 L 15 35 Z" className="text-emerald-500/50" fill="currentColor" fillOpacity="0.15" />
          <path d="M 50 20 L 50 90" className="text-theme-accent/60" />
          <path d="M 15 35 L 50 50 L 85 35" className="text-theme-accent/60" />
        </svg>
      );
    default:
      return null;
  }
}

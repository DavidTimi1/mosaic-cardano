"use client";
import React from 'react';
import { PinIcon, PlusCircle } from 'lucide-react';
import { useGetVillageNeeds } from '@/services/villages';
import Link from 'next/link';

export default function VillagePinnedBoard() {
  const { data: needs, isLoading } = useGetVillageNeeds();

  if (!isLoading && !needs?.length) return null;

  return (
    <div className="bg-theme-surface-high border border-theme-accent/30 rounded-xl p-3 shadow-sm mb-6 flex items-center gap-4 overflow-x-auto scrollbar-hide">
      <div className="flex items-center gap-2 text-theme-accent shrink-0 pl-2">
        <PinIcon size={16} className="fill-current" />
        <span className="font-sans text-[10px] uppercase tracking-widest font-bold">Top Bounties</span>
      </div>
      
      <div className="flex gap-3 items-center">
        {isLoading ? (
          <div className="flex gap-3 animate-pulse">
            <div className="w-48 h-10 bg-theme-parchment rounded border border-theme-outline/20"></div>
            <div className="w-48 h-10 bg-theme-parchment rounded border border-theme-outline/20"></div>
          </div>
        ) : (
          needs?.slice(0, 3).map((need) => (
            <Link href={`/studio`} key={need.id} className="block shrink-0">
              <div className="px-4 py-2 bg-theme-parchment border border-theme-outline/30 rounded-lg flex gap-4 items-center group cursor-pointer hover:border-theme-clay hover:shadow-sm transition-all">
                <div>
                  <p className="font-bold text-theme-forest text-xs">{need.role}</p>
                  <p className="text-[10px] text-theme-on-surface/50">{need.project}</p>
                </div>
                <PlusCircle size={14} className="text-theme-accent opacity-50 group-hover:opacity-100 transition-all" />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

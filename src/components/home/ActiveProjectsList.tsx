"use client";
import React from 'react';
import Link from 'next/link';
import { useGetActiveProjects } from '@/services/home';
import { ChevronRight } from 'lucide-react';

export default function ActiveProjectsList() {
  const { data: projects, isLoading } = useGetActiveProjects();

  return (
    <div className="mb-12">
      <div className="flex items-end justify-between mb-6 border-b border-theme-outline/30 pb-2">
        <h2 className="font-serif text-2xl font-medium text-theme-forest">Active Projects</h2>
        <Link href="/project" className="font-sans text-[10px] uppercase tracking-widest text-theme-on-surface/70 mb-1 cursor-pointer hover:text-theme-accent">
          View All Library
        </Link>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-theme-surface-low rounded-lg border border-theme-outline/20"></div>
            <div className="h-32 bg-theme-surface-low rounded-lg border border-theme-outline/20"></div>
          </div>
        ) : (
          projects?.map((project) => (
            <Link href={project.link} key={project.id} className="block">
              <div className="bg-theme-surface-low p-6 border border-theme-outline/40 rounded-lg group hover:border-theme-clay/50 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-widest text-theme-accent mb-1">{project.community}</p>
                    <h4 className="font-serif text-xl mb-1">{project.title}</h4>
                    <p className="text-theme-on-surface/70 text-sm max-w-xl">{project.description}</p>
                  </div>
                  <span className="bg-theme-forest text-theme-parchment px-3 py-1 font-sans text-[10px] uppercase tracking-widest rounded-sm">
                    {project.progress}% Complete
                  </span>
                </div>
                <div className="w-full h-1.5 bg-theme-outline/30 rounded-full overflow-hidden mb-6">
                  <div className="h-full bg-theme-clay" style={{ width: `${project.progress}%` }}></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                      {project.collaborators.slice(0, 3).map((name, i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-theme-surface-low bg-theme-outline/20 flex items-center justify-center text-[10px] font-bold text-theme-forest" title={name}>
                          {name.charAt(0)}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-theme-on-surface/60 font-sans">{project.lastActivity}</span>
                  </div>
                  <button className="text-theme-accent font-sans text-[10px] uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Enter Studio <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

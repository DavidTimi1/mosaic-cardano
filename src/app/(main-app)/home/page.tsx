import React from 'react';
import ActionItems from '@/components/home/ActionItems';
import ActiveProjectsList from '@/components/home/ActiveProjectsList';
import CommunityUpdates from '@/components/home/CommunityUpdates';
import SavedItems from '@/components/home/SavedItems';
import { TopAppBarWrapper } from '@/components/layout/TopAppBar';

export default function HomePage() {
  return (
    <TopAppBarWrapper>
      <div className="p-6 md:p-12 lg:p-24 w-full pb-20">

        <header className="mb-12">
          <h1 className="font-serif text-3xl font-medium text-theme-forest mb-2">Your Workspace</h1>
          <p className="text-theme-on-surface/60 font-sans leading-relaxed">
            Welcome back. Here is what needs your attention across your communities.
          </p>
        </header>

        <div className="grid grid-cols-12 gap-12 overflow-y-hidden">

          {/* Main Focus Area */}
          <section className="col-span-12 lg:col-span-8 h-full overflow-y-auto">
            <ActionItems />
            <ActiveProjectsList />
            <CommunityUpdates />
          </section>

          {/* Discovery & Periphery Sidebar */}
          <aside className="col-span-12 lg:col-span-4 space-y-12">
            <SavedItems />
          </aside>

        </div>
      </div>
    </TopAppBarWrapper>
  );
}

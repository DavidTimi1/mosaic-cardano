"use client";

import React, { useState } from 'react';
import { useGetVillageSettings } from '@/services/villages';
import { Loader2, ShieldAlert } from 'lucide-react';
import ProfileSection from './ProfileSection';
import DescriptionEditor from './DescriptionEditor';
import PrivacySettings from './PrivacySettings';
import MemberManagement from './MemberManagement';
import ActivityLog from './ActivityLog';

interface Props {
  communityId: string;
}

export default function VillageSettingsView({ communityId }: Props) {
  const { data: settings, isLoading } = useGetVillageSettings(communityId);
  const [activeTab, setActiveTab] = useState<'general' | 'members' | 'activity'>('general');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-theme-accent" />
      </div>
    );
  }

  if (!settings) {
    return <div className="p-8 text-center text-theme-on-surface/50">Settings not found</div>;
  }

  const isCreator = settings.isCreator ?? false;

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-theme-surface">
      <div className="max-w-4xl w-full mx-auto p-6 md:p-8 space-y-8">
        
        <header>
          <h1 className="text-3xl font-display font-bold text-theme-on-surface mb-2">Village Settings</h1>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-theme-surface-raised border border-theme-accent/20 text-theme-accent">
            <ShieldAlert className="w-6 h-6 shrink-0 mt-0.5" />
            <p className="text-sm font-sans">
              <strong>Progressive Decentralization:</strong> This community is currently in the bootstrap phase under founder stewardship. 
              As the village matures, governance and settings control will transition into decentralized, community-driven voting.
            </p>
          </div>
        </header>

        <div className="flex gap-4 border-b border-theme-outline/20">
          <button
            onClick={() => setActiveTab('general')}
            className={`pb-3 px-2 font-sans font-medium transition-colors border-b-2 ${
              activeTab === 'general' ? 'border-theme-accent text-theme-on-surface' : 'border-transparent text-theme-on-surface/60 hover:text-theme-on-surface'
            }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`pb-3 px-2 font-sans font-medium transition-colors border-b-2 ${
              activeTab === 'members' ? 'border-theme-accent text-theme-on-surface' : 'border-transparent text-theme-on-surface/60 hover:text-theme-on-surface'
            }`}
          >
            Members
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`pb-3 px-2 font-sans font-medium transition-colors border-b-2 ${
              activeTab === 'activity' ? 'border-theme-accent text-theme-on-surface' : 'border-transparent text-theme-on-surface/60 hover:text-theme-on-surface'
            }`}
          >
            Activity Log
          </button>
        </div>

        <div className="space-y-12">
          {activeTab === 'general' && (
            <>
              <ProfileSection communityId={communityId} settings={settings} isCreator={isCreator} />
              <DescriptionEditor communityId={communityId} settings={settings} isCreator={isCreator} />
              <PrivacySettings communityId={communityId} settings={settings} isCreator={isCreator} />
            </>
          )}

          {activeTab === 'members' && (
            <MemberManagement communityId={communityId} isCreator={isCreator} />
          )}

          {activeTab === 'activity' && (
            <ActivityLog communityId={communityId} />
          )}
        </div>
      </div>
    </div>
  );
}

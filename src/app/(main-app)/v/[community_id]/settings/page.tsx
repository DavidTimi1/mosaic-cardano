"use client";

import React from 'react';
import VillageSettingsView from '@/components/village/settings/VillageSettingsView';
import { useParams } from 'next/navigation';

export default function VillageSettingsPage() {
  const params = useParams();
  const communityId = params.community_id as string;

  return (
    <VillageSettingsView communityId={communityId} />
  );
}

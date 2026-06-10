import React, { useState } from 'react';
import { useUpdateVillageSettings, VillageSettings } from '@/services/villages';
import { Button } from '@/components/ui/button';

interface Props {
  communityId: string;
  settings: VillageSettings;
  isCreator: boolean;
}

export default function DescriptionEditor({ communityId, settings, isCreator }: Props) {
  const [description, setDescription] = useState(settings.description ?? '');
  const { mutate: updateSettings, isPending } = useUpdateVillageSettings(communityId);

  const handleSave = () => {
    if (!isCreator) return;
    updateSettings({ description });
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-semibold text-theme-on-surface">Village Guidelines & Description</h2>
        {isCreator && (
          <Button onClick={handleSave} disabled={isPending || description === settings.description}>
            {isPending ? 'Saving...' : 'Save Description'}
          </Button>
        )}
      </div>
      <p className="text-sm text-theme-on-surface/60 font-sans">
        Set the tone for your community. Outline the rules, goals, and what members should expect.
      </p>
      
      <div className="relative">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={!isCreator}
          placeholder="Welcome to our Village! Here we focus on..."
          className="w-full h-48 bg-theme-surface border border-theme-outline/20 rounded-lg p-4 font-sans text-theme-on-surface disabled:opacity-50 resize-none focus:outline-none focus:border-theme-accent"
        />
        {!isCreator && (
          <div className="absolute inset-0 cursor-not-allowed" title="Read-only: Only the creator can update the description." />
        )}
      </div>
    </section>
  );
}

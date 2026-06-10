import React, { useState } from 'react';
import { useUpdateVillageSettings, VillageSettings } from '@/services/villages';
import { Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  communityId: string;
  settings: VillageSettings;
  isCreator: boolean;
}

export default function ProfileSection({ communityId, settings, isCreator }: Props) {
  const [logoUrl, setLogoUrl] = useState(settings?.profileImageUrl ?? '');
  const { mutate: updateSettings, isPending } = useUpdateVillageSettings(communityId);

  const handleSave = () => {
    if (!isCreator) return;
    updateSettings({ logoUrl });
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-display font-semibold text-theme-on-surface">Community Logo</h2>
      <div className="flex items-start gap-6">
        <div className="w-24 h-24 rounded-2xl bg-theme-surface-raised border border-theme-outline/20 flex items-center justify-center overflow-hidden shrink-0">
          {logoUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={logoUrl} alt="Community Logo" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-8 h-8 text-theme-on-surface/30" />
          )}
        </div>
        
        <div className="flex-1 space-y-4">
          <p className="text-sm text-theme-on-surface/60 font-sans">
            This is the primary image representing your village across the platform.
          </p>
          <div className="flex items-center gap-3">
            <input 
              type="text" 
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              disabled={!isCreator}
              placeholder="https://example.com/logo.png"
              className="flex-1 bg-theme-surface border border-theme-outline/20 rounded-lg px-4 py-2 font-sans text-theme-on-surface disabled:opacity-50"
            />
            {isCreator && (
              <Button onClick={handleSave} disabled={isPending || logoUrl === settings.profileImageUrl}>
                Save Logo
              </Button>
            )}
          </div>
          {!isCreator && (
            <p className="text-xs text-theme-on-surface/40 italic">Read-only: Only the creator can update the logo.</p>
          )}
        </div>
      </div>
    </section>
  );
}

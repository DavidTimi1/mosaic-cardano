import React from 'react';
import { useDebouncedSettingsUpdate } from '@/services/settings';
import { UserSettings } from '@/types/settings';
import { Switch } from '@/components/ui/switch';

export default function FeedTab({ settings }: { settings: UserSettings['feed'] }) {
  const { mutate } = useDebouncedSettingsUpdate();

  const handleToggleAutoplay = (checked: boolean) => {
    mutate({ feed: { ...settings, autoplayMedia: checked } });
  };

  const handleViewChange = (view: 'CARD' | 'COMPACT') => {
    mutate({ feed: { ...settings, defaultView: view } });
  };

  return (
    <div className="space-y-8 animate-onrender --fade-in">
      <div>
        <h2 className="text-xl font-bold text-theme-forest mb-2">Feed Settings</h2>
        <p className="text-sm text-theme-on-surface/60">Customize how content is displayed in your feed.</p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between py-2">
          <div>
            <h3 className="text-sm font-bold text-theme-on-surface">Autoplay Media</h3>
            <p className="text-xs text-theme-on-surface/60 mt-1">Automatically play videos and GIFs when they appear on screen.</p>
          </div>
          <Switch 
            checked={settings.autoplayMedia}
            onCheckedChange={handleToggleAutoplay}
          />
        </div>

        <hr className="border-theme-outline/10" />

        <div className="py-2">
          <div>
            <h3 className="text-sm font-bold text-theme-on-surface mb-3">Default View</h3>
            <p className="text-xs text-theme-on-surface/60 mt-1 mb-4">Choose how posts look in your home feed.</p>
          </div>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 cursor-pointer p-3 border border-theme-outline/20 rounded-xl hover:border-theme-clay/40 transition-colors bg-theme-surface-high">
              <input 
                type="radio" 
                name="defaultView" 
                value="CARD"
                checked={settings.defaultView === 'CARD'}
                onChange={() => handleViewChange('CARD')}
                className="w-4 h-4 text-theme-accent focus:ring-theme-accent"
              />
              <div>
                <span className="block text-sm font-bold text-theme-forest">Card</span>
                <span className="block text-xs text-theme-on-surface/60">Standard view with full-size images and content</span>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-3 border border-theme-outline/20 rounded-xl hover:border-theme-clay/40 transition-colors bg-theme-surface-high">
              <input 
                type="radio" 
                name="defaultView" 
                value="COMPACT"
                checked={settings.defaultView === 'COMPACT'}
                onChange={() => handleViewChange('COMPACT')}
                className="w-4 h-4 text-theme-accent focus:ring-theme-accent"
              />
              <div>
                <span className="block text-sm font-bold text-theme-forest">Compact</span>
                <span className="block text-xs text-theme-on-surface/60">Dense view that fits more content on the screen</span>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

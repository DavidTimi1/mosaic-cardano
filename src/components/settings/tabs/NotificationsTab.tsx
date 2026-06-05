import React from 'react';
import { useDebouncedSettingsUpdate } from '@/services/settings';
import { UserSettings } from '@/types/settings';
import { Switch } from '@/components/ui/switch';

export default function NotificationsTab({ settings }: { settings: UserSettings['notifications'] }) {
  const { mutate } = useDebouncedSettingsUpdate();

  const handleToggle = (key: keyof UserSettings['notifications'], checked: boolean) => {
    mutate({ notifications: { ...settings, [key]: checked } });
  };

  const SettingToggle = ({ 
    checked, 
    onChange, 
    title, 
    description 
  }: { 
    checked: boolean; 
    onChange: (c: boolean) => void; 
    title: string; 
    description: string;
  }) => (
    <div className="flex items-center justify-between py-3">
      <div className="pr-4">
        <h3 className="text-sm font-bold text-theme-on-surface">{title}</h3>
        <p className="text-xs text-theme-on-surface/60 mt-1">{description}</p>
      </div>
      <Switch 
        checked={checked}
        onCheckedChange={onChange}
      />
    </div>
  );

  return (
    <div className="space-y-8 animate-onrender --fade-in">
      <div>
        <h2 className="text-xl font-bold text-theme-forest mb-2">Notification Settings</h2>
        <p className="text-sm text-theme-on-surface/60">Choose how and when you want to be notified.</p>
      </div>

      <div className="space-y-2">
        <h3 className="font-serif text-theme-forest mb-4 border-b border-theme-outline/10 pb-2">Global Notifications</h3>
        <SettingToggle 
          checked={settings.pushEnabled} 
          onChange={(c) => handleToggle('pushEnabled', c)} 
          title="Push Notifications" 
          description="Allow Mosaic to send you push notifications on this device."
        />
      </div>

      <div className="space-y-2">
        <h3 className="font-serif text-theme-forest mb-4 border-b border-theme-outline/10 pb-2 mt-8">Email Notifications</h3>
        
        <SettingToggle 
          checked={settings.emailMentions} 
          onChange={(c) => handleToggle('emailMentions', c)} 
          title="Mentions & Tags" 
          description="Get an email when someone mentions you in a comment or artifact."
        />
        
        <SettingToggle 
          checked={settings.emailReplies} 
          onChange={(c) => handleToggle('emailReplies', c)} 
          title="Replies to your content" 
          description="Get an email when someone replies to your comments or artifacts."
        />

        <SettingToggle 
          checked={settings.emailCommunityAlerts} 
          onChange={(c) => handleToggle('emailCommunityAlerts', c)} 
          title="Community Alerts" 
          description="Get emails for important announcements from villages you are a member of."
        />
      </div>
    </div>
  );
}

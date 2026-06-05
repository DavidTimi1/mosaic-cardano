import React, { useState, useEffect } from 'react';
import { useGetAuthState } from '@/services/auth';
import { useGetUserProfile, useUpdateUserProfile } from '@/services/users';
import { useDebouncedSettingsUpdate } from '@/services/settings';
import { UserSettings } from '@/types/settings';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';
import { toast } from 'sonner';

export default function ProfileTab({ settings }: { settings?: UserSettings['profile'] }) {
  const { data: authState } = useGetAuthState();
  const user = authState?.user;
  
  // We fetch the full profile to get the actual bio
  const { data: fullProfile } = useGetUserProfile(user?.username || '');
  const updateProfileMutation = useUpdateUserProfile();
  const { mutate: updateSettings } = useDebouncedSettingsUpdate();

  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');

  // Sync profile data when loaded
  useEffect(() => {
    if (fullProfile) {
      setDisplayName(fullProfile.displayName || '');
      setBio(fullProfile.bio || '');
    } else if (user) {
      setDisplayName(user.name || '');
    }
  }, [fullProfile, user]);

  const handleSaveProfile = async () => {
    if (!displayName.trim()) {
      toast.error('Display name cannot be empty');
      return;
    }
    try {
      await updateProfileMutation.mutateAsync({
        displayName,
        bio
      });
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  const handleToggleVisibility = (key: keyof UserSettings['profile'], value: boolean) => {
    if (!settings) return;
    updateSettings({ profile: { ...settings, [key]: value } });
  };

  return (
    <div className="space-y-8 animate-onrender --fade-in">
      <div>
        <h2 className="text-xl font-bold text-theme-forest mb-2">Profile Settings</h2>
        <p className="text-sm text-theme-on-surface/60">Customize how your profile appears to others.</p>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-theme-on-surface">Avatar</label>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-theme-outline/20 overflow-hidden flex items-center justify-center font-bold text-2xl text-theme-forest border-2 border-theme-clay/30">
              {user?.avatarUrl && user.avatarUrl !== 'null' ? (
                <Image src={user.avatarUrl} alt="Avatar" width={80} height={80} className="w-full h-full object-cover" />
              ) : (
                <span>{user?.initials || 'U'}</span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm">Upload Image</Button>
              <p className="text-[10px] text-theme-on-surface/50">Must be JPEG, PNG, or GIF and cannot exceed 10MB.</p>
            </div>
          </div>
        </div>

        <hr className="border-theme-outline/10" />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-theme-on-surface">Display Name</label>
          <input 
            type="text" 
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            className="w-full md:w-96 p-2.5 bg-theme-surface-high border border-theme-outline/20 rounded-xl focus:outline-none focus:border-theme-clay/55 text-sm font-medium text-theme-on-surface"
          />
          <p className="text-xs text-theme-on-surface/50">This is your public-facing name. It doesn&apos;t need to be unique.</p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-theme-on-surface">Username</label>
          <input 
            type="text" 
            disabled
            value={user?.username || ''}
            className="w-full md:w-96 p-2.5 bg-theme-surface-high border border-theme-outline/20 rounded-xl text-sm font-medium text-theme-on-surface opacity-70 cursor-not-allowed"
          />
          <p className="text-xs text-theme-on-surface/50">Your username is unique and cannot be changed.</p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-theme-on-surface">About (Bio)</label>
          <textarea 
            rows={4}
            value={bio}
            onChange={e => setBio(e.target.value)}
            placeholder="A brief description of yourself..."
            className="w-full p-2.5 bg-theme-surface-high border border-theme-outline/20 rounded-xl focus:outline-none focus:border-theme-clay/55 text-sm font-medium text-theme-on-surface resize-none"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <Button onClick={handleSaveProfile} disabled={updateProfileMutation.isPending || !displayName.trim()}>
            {updateProfileMutation.isPending ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>

        {settings && (
          <>
            <hr className="border-theme-outline/10 my-8" />
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-theme-on-surface mb-1">Profile Visibility</h3>
                <p className="text-xs text-theme-on-surface/60">Control what information is visible on your public passport.</p>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="pr-4">
                  <h4 className="text-sm font-bold text-theme-on-surface">Show Badges</h4>
                  <p className="text-xs text-theme-on-surface/60 mt-1">Display your earned reputation badges and honors on your profile.</p>
                </div>
                <Switch 
                  checked={settings.showBadges ?? true}
                  onCheckedChange={(c) => handleToggleVisibility('showBadges', c)}
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="pr-4">
                  <h4 className="text-sm font-bold text-theme-on-surface">Show Communities</h4>
                  <p className="text-xs text-theme-on-surface/60 mt-1">Display the communities you are a member of.</p>
                </div>
                <Switch 
                  checked={settings.showCommunities ?? true}
                  onCheckedChange={(c) => handleToggleVisibility('showCommunities', c)}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

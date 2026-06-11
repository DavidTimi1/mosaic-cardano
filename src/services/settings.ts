import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserSettings, defaultUserSettings } from '@/types/settings';
import { useRef, useCallback, useState } from 'react';
import { toast } from 'sonner';

const fetchSettings = async (): Promise<UserSettings> => {
  const res = await fetch('/api/settings');
  if (!res.ok) {
    if (res.status === 401) {
      return defaultUserSettings; // Fallback for unauthenticated
    }
    throw new Error('Failed to fetch settings');
  }
  return res.json();
};

const updateSettings = async (settings: Partial<UserSettings>): Promise<UserSettings> => {
  const res = await fetch('/api/settings', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  if (!res.ok) {
    throw new Error('Failed to update settings');
  }
  return res.json();
};

export const useGetSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: fetchSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useDebouncedSettingsUpdate = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({ mutationFn: updateSettings });
  const [isPending, setIsPending] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const pendingUpdates = useRef<Partial<UserSettings>>({});
  const snapshot = useRef<UserSettings | undefined>(undefined);

  const updateSettingOptimistically = useCallback(
    (newPartial: Partial<UserSettings>) => {
      // Save snapshot if this is the first change in a sequence
      if (!debounceTimer.current) {
        snapshot.current = queryClient.getQueryData<UserSettings>(['settings']);
        setIsPending(true);
      }

      // Merge into pending
      pendingUpdates.current = { ...pendingUpdates.current, ...newPartial };

      // Optimistic update
      queryClient.setQueryData<UserSettings>(['settings'], (old) => {
        if (!old) return old;
        return {
          ...old,
          privacy: newPartial.privacy ? { ...old.privacy, ...newPartial.privacy } : old.privacy,
          feed: newPartial.feed ? { ...old.feed, ...newPartial.feed } : old.feed,
          notifications: newPartial.notifications ? { ...old.notifications, ...newPartial.notifications } : old.notifications,
        };
      });

      // Reset timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(async () => {
        const payload = pendingUpdates.current;
        pendingUpdates.current = {};
        debounceTimer.current = null;
        const currentSnapshot = snapshot.current;

        try {
          await mutation.mutateAsync(payload);
          queryClient.invalidateQueries({ queryKey: ['settings'] });
        } catch {
          // Revert to snapshot
          if (currentSnapshot) {
            queryClient.setQueryData(['settings'], currentSnapshot);
          }
          toast.error("Failed to save settings", {
            description: "Your changes have been reverted.",
          });
        } finally {
          setIsPending(false);
        }
      }, 2000);
    },
    [mutation, queryClient]
  );

  return { mutate: updateSettingOptimistically, isPending };
};

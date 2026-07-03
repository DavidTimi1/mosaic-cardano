import { useXQuery } from "@/lib/extended-react-query";

export interface UserProfile {
  id: string;
  displayName: string;
  isVerified: boolean;
  handle: string;
  bio: string;
  joinedDate: string;
  walletAddress: string;
}

export interface PublishedWork {
  id: string;
  title: string;
  type: string;
  community: string;
  date: string;
}

export interface Contribution {
  id: string;
  action: string;
  target: string;
  community: string;
  date: string;
  description: string;
}

export interface UserRep {
  id: string;
  type: string;
  status: string;
  // Mapped on frontend
  name?: string;
  icon?: string;
}

export interface Reputation {
  badges: UserRep[];
  skills: string[];
  communities: {
    id: string;
    name: string;
    role: string;
  }[];
  projects: string[];
  supportHistory: {
    id: string;
    type: string;
    amount: string;
    source: string;
    reason: string;
  }[];
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAPI } from './api';
import { getBadgeConfig } from '@/lib/badges';

export const useGetUserProfile = (username: string) => {
  return useXQuery<UserProfile>({
    queryKey: ['userProfile', username],
    queryFn: async () => {
      return fetchAPI(`/api/users/${username}`) as Promise<UserProfile>;
    }
  });
};

export const useGetUserPublishedWorks = (username: string) => {
  return useXQuery<PublishedWork[]>({
    queryKey: ['userWorks', username],
    queryFn: async () => {
      return fetchAPI(`/api/users/${username}/works`) as Promise<PublishedWork[]>;
    }
  });
};

export const useGetUserContributions = (username: string) => {
  return useXQuery<Contribution[]>({
    queryKey: ['userContributions', username],
    queryFn: async () => {
      return fetchAPI(`/api/users/${username}/contributions`) as Promise<Contribution[]>;
    }
  });
};

export const useGetUserReputation = (username: string) => {
  return useXQuery<Reputation>({
    queryKey: ['userReputation', username],
    queryFn: async () => {
      const data = await fetchAPI(`/api/users/${username}/reputation`) as Reputation;
      
      // Frontend badge mapping
      data.badges = data.badges.map(b => {
        const config = getBadgeConfig(b.type);
        return {
          ...b,
          name: config.name,
          icon: config.icon
        };
      });
      
      return data;
    }
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { displayName?: string; bio?: string }) => {
      return fetchAPI('/api/users/me', {
        method: 'PATCH',
        data: data,
      });
    },
    onSuccess: () => {
      // Invalidate queries so UI updates
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    }
  });
};

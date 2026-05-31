import { API } from '@/lib/api-routes';
import {
  MOCK_HOME_ACTION_ITEMS,
  MOCK_HOME_ACTIVE_PROJECTS,
  MOCK_HOME_COMMUNITY_UPDATES,
  MOCK_HOME_SAVED_ITEMS,
} from '@/data/mock';
import {
  ACTION_ITEM_TYPE_LABELS,
  HOME_QUERY_KEYS,
  parseHomeActionItems,
  parseHomeActiveProjects,
  parseHomeCommunityUpdates,
  parseSavedItems,
} from '@/lib/home';
import { useXQuery } from '@/lib/extended-react-query';
import { fetchAPI } from './api';

export interface HomeActionItem {
  id: string;
  type: 'INVITE' | 'MENTION' | 'PROJECT_UPDATE';
  title: string;
  description: string;
  timestamp: string;
  source: string;
  link: string;
}

export interface HomeProjectSummary {
  id: string;
  title: string;
  community: string;
  description: string;
  progress: number;
  lastActivity: string;
  collaborators: string[];
  link: string;
}

export interface HomeCommunityUpdate {
  id: string;
  type: 'governance' | 'discussion' | 'treasury' | string;
  community: string;
  title: string;
  description: string;
  timestamp: string;
  status: string;
  link: string;
}

export interface SavedItemSummary {
  id: string;
  title: string;
  type: string;
  author: string;
  link: string;
}

type ApiListResponse<T> = {
  items?: T[];
  data?: T[];
  results?: T[];
};

const unwrapList = <T>(payload: unknown): T[] => {
  if (!payload || typeof payload !== 'object') {
    return [];
  }

  const typedPayload = payload as ApiListResponse<T>;
  return typedPayload.items ?? typedPayload.data ?? typedPayload.results ?? [];
};

const fetchHomeItems = async <T>(url: string): Promise<T[]> => {
  const res = await fetchAPI(url);
  return unwrapList<T>(res);
};

const fetchHomeItemsWithFallback = async <T>(url: string, fallback: T[]): Promise<T[]> => {
  try {
    const items = await fetchHomeItems<T>(url);
    return items.length > 0 ? items : fallback;
  } catch {
    return fallback;
  }
};

export const useGetActionItems = () => {
  return useXQuery({
    queryKey: HOME_QUERY_KEYS.ACTION_ITEMS,
    queryFn: async () => parseHomeActionItems({
      items: await fetchHomeItemsWithFallback(API.HOME.ACTION_ITEMS, [...MOCK_HOME_ACTION_ITEMS]),
    }),
  });
};

export const getActionItemLabel = (type: HomeActionItem['type']) => {
  return ACTION_ITEM_TYPE_LABELS[type] ?? type;
};

export const useGetActiveProjects = () => {
  return useXQuery({
    queryKey: HOME_QUERY_KEYS.ACTIVE_PROJECTS,
    queryFn: async () => parseHomeActiveProjects({
      items: await fetchHomeItemsWithFallback(API.HOME.ACTIVE_PROJECTS, [...MOCK_HOME_ACTIVE_PROJECTS]),
    }),
  });
};

export const useGetCommunityUpdates = () => {
  return useXQuery({
    queryKey: HOME_QUERY_KEYS.COMMUNITY_UPDATES,
    queryFn: async () => parseHomeCommunityUpdates({
      items: await fetchHomeItemsWithFallback(API.HOME.COMMUNITY_UPDATES, [...MOCK_HOME_COMMUNITY_UPDATES]),
    }),
  });
};

export const useGetSavedItems = () => {
  return useXQuery({
    queryKey: HOME_QUERY_KEYS.SAVED_ITEMS,
    queryFn: async () => parseSavedItems({
      items: await fetchHomeItemsWithFallback(API.HOME.SAVED_ITEMS, [...MOCK_HOME_SAVED_ITEMS]),
    }),
  });
};

import { API } from '@/lib/api-routes';
import {
  MOCK_FEATURED_ARTIFACTS,
  MOCK_FEATURED_VILLAGE_CARDS,
  MOCK_MY_VILLAGES,
  MOCK_TREASURY_ALLOCATIONS,
  MOCK_VILLAGE_DETAILS,
  MOCK_VILLAGE_FEATURED_WORKS,
  MOCK_VILLAGE_MEMBERS,
  MOCK_VILLAGE_NEEDS,
  MOCK_VILLAGE_PROJECTS,
  MOCK_VILLAGE_STREAM,
  MOCK_VILLAGE_TIMELINE,
} from '@/data/mock';
import { useXQuery } from '@/lib/extended-react-query';
import { fetchAPI } from './api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export interface VillageDetail {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  treasuryBalance: string;
  isMember: boolean;
}

export interface VillageSummary {
  id: string;
  name: string;
  description?: string;
  profileImageUrl?: string | null;
  memberCount?: number;
  icon?: string;
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const mapVillageToCard = (village: VillageSummary) => ({
  id: village.id,
  name: village.name,
  desc: village.description ?? '',
  members: village.memberCount ?? 0,
  icon: village.icon ?? '🏛️',
});

const unwrapVillageList = <T>(response: unknown): T[] => {
  if (!response || typeof response !== 'object') {
    return [];
  }

  const typedResponse = response as { items?: T[]; data?: T[]; results?: T[] };
  return typedResponse.items ?? typedResponse.data ?? typedResponse.results ?? [];
};

const fetchVillageList = async <T>(url: string): Promise<T[]> => {
  const response = await fetchAPI(url);
  return unwrapVillageList<T>(response);
};

const fetchFeaturedVillageCards = async () => {
  const items = await fetchVillageList<VillageSummary>(API.VILLAGE.LIST);
  return items.map(mapVillageToCard);
};

// --- Hooks ---
export const useGetVillageDetails = (id: string) => {
  return useXQuery({
    queryKey: ['villageDetails', id],
    queryFn: async () => {
      await delay(5000);
      return MOCK_VILLAGE_DETAILS[id] || null;
    }
  });
};

export const useGetVillageProjects = () => {
  return useXQuery({
    queryKey: ['villageProjects'],
    queryFn: async () => {
      await delay(800);
      return MOCK_VILLAGE_PROJECTS;
    }
  });
};

export const addMockVillageProject = (project: { id: string, title: string, description: string, progress: number, contributors: number }) => {
  MOCK_VILLAGE_PROJECTS.unshift(project);
};

export const useGetVillageStream = () => {
  return useXQuery({
    queryKey: ['villageStream'],
    queryFn: async () => {
      await delay(1000);
      return MOCK_VILLAGE_STREAM;
    }
  });
};

export const useGetVillageNeeds = () => {
  return useXQuery({
    queryKey: ['villageNeeds'],
    queryFn: async () => {
      await delay(600);
      return MOCK_VILLAGE_NEEDS;
    }
  });
};

export const useGetVillageTimeline = () => {
  return useXQuery({
    queryKey: ['villageTimeline'],
    queryFn: async () => {
      await delay(500);
      return MOCK_VILLAGE_TIMELINE;
    }
  });
};

export const useGetFeaturedVillages = () => {
  return useXQuery({
    queryKey: ['featuredVillages'],
    queryFn: fetchFeaturedVillageCards,
  });
}

export const useGetMyVillages = (enabled = true) => {
  return useXQuery({
    queryKey: ['myVillages'],
    queryFn: () => fetchVillageList<VillageSummary>(API.VILLAGE.MY),
    enabled,
  });
};

export const useCreateVillage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { name: string; description: string; tags: string[] }) => {
      await delay(1500); // simulate network
      
      const newId = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      // Update featured villages
      MOCK_FEATURED_VILLAGE_CARDS.unshift({
        id: newId,
        name: data.name,
        desc: data.description,
        members: 1,
        icon: '🌱'
      });

      MOCK_MY_VILLAGES.unshift({
        id: newId,
        name: data.name,
        description: data.description,
        profileImageUrl: null,
        memberCount: 1,
        icon: '🌱',
      } as typeof MOCK_MY_VILLAGES[0]);
      
      // Add village details
      MOCK_VILLAGE_DETAILS[newId] = {
        id: newId,
        name: data.name,
        description: data.description,
        memberCount: 1,
        treasuryBalance: '0 SCR',
        isMember: true,
      };
      
      return newId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featuredVillages'] });
    }
  });
};

export const useGetFeaturedArtifacts = () => {
  return useXQuery({
    queryKey: ['featuredArtifacts'],
    queryFn: async () => {
      await delay(700);
      return [...MOCK_FEATURED_ARTIFACTS];
    }
  });
};

export const useGetVillageFeaturedWorks = (villageId: string) => {
  return useXQuery({
    queryKey: ['villageFeaturedWorks', villageId],
    queryFn: async () => {
      await delay(500);
      return MOCK_VILLAGE_FEATURED_WORKS;
    }
  });
};

export const useGetVillageTreasuryAllocations = (villageId: string) => {
  return useXQuery({
    queryKey: ['villageTreasuryAllocations', villageId],
    queryFn: async () => {
      await delay(400);
      return MOCK_TREASURY_ALLOCATIONS;
    }
  });
};

export const useGetVillageMembers = (villageId: string) => {
  return useXQuery({
    queryKey: ['villageMembers', villageId],
    queryFn: async () => {
      await delay(300);
      return MOCK_VILLAGE_MEMBERS;
    }
  });
};


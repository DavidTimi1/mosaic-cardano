import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ExploreFilters {
  query: string;
  topic: string;
  location: string;
  visibility: string;
  activityLevel: string;
}

interface ExploreState {
  hasVisitedExplore: boolean;
  activeTab: string;
  filters: ExploreFilters;
  joinedCommunities: string[];
  setHasVisitedExplore: (visited: boolean) => void;
  setActiveTab: (tab: string) => void;
  setFilter: <K extends keyof ExploreFilters>(key: K, value: ExploreFilters[K]) => void;
  resetFilters: () => void;
  joinCommunity: (id: string) => void;
}

const initialFilters: ExploreFilters = {
  query: '',
  topic: '',
  location: '',
  visibility: '',
  activityLevel: '',
};

export const useExploreStore = create<ExploreState>()(
  persist(
    (set) => ({
      hasVisitedExplore: false,
      activeTab: 'all',
      filters: initialFilters,
      joinedCommunities: ['scribes-of-sahel'], // default joined community

      setHasVisitedExplore: (visited) => set({ hasVisitedExplore: visited }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setFilter: (key, value) =>
        set((state) => ({
          filters: {
            ...state.filters,
            [key]: value,
          },
        })),
      resetFilters: () => set({ filters: initialFilters }),
      joinCommunity: (id) =>
        set((state) => ({
          joinedCommunities: state.joinedCommunities.includes(id)
            ? state.joinedCommunities
            : [...state.joinedCommunities, id],
        })),
    }),
    {
      name: 'mosaic-explore-store',
    }
  )
);

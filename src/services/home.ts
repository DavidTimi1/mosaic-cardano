import { useXQuery } from "@/lib/extended-react-query";

// ============================================================================
// DUMMY DATA
// ============================================================================

const MOCK_ACTION_ITEMS = [
  {
    id: 'a1',
    type: 'invitation',
    title: 'Invitation to Collaborate',
    description: 'You have been invited to join the "Nairobi Trail Runners" core mapping team.',
    timestamp: '2 hours ago',
    source: 'Nairobi Trail Runners',
    link: '/inbox',
  },
  {
    id: 'a2',
    type: 'review',
    title: 'Pending Artifact Review',
    description: 'Amina D. requested your review on "Chapter 4: The Savannah Routes".',
    timestamp: '5 hours ago',
    source: 'Savannah Chronicles Project',
    link: '/studio',
  }
];

const MOCK_ACTIVE_PROJECTS = [
  {
    id: 'p1',
    title: 'Savannah Chronicles',
    community: 'Nairobi Trail Runners',
    description: 'Documenting the hidden trail routes through the eastern savannah.',
    progress: 65,
    lastActivity: 'Draft updated 3h ago by you',
    collaborators: ['You', 'Amina D.', 'Kofi M.'],
    link: '/studio',
  },
  {
    id: 'p2',
    title: 'Lagos Poetry Anthology Volume II',
    community: 'Lagos Poetry Collective',
    description: 'Curating the second volume of modern spoken word transcripts.',
    progress: 30,
    lastActivity: 'New submission pending review',
    collaborators: ['You', 'Oluwaseun B.'],
    link: '/studio',
  }
];

const MOCK_COMMUNITY_UPDATES = [
  {
    id: 'u1',
    type: 'governance',
    community: 'Lagos Poetry Collective',
    title: 'Vote: Allocate 5,000 SCR for the Annual Recital',
    description: 'Proposal to use treasury funds to secure the venue for next month\'s event.',
    timestamp: '1 day ago',
    status: 'Active (Ends in 2 days)',
    link: '/v/lagos-poetry/governance',
  },
  {
    id: 'u2',
    type: 'discussion',
    community: 'Nairobi Trail Runners',
    title: 'Urgent: Route 4 Washout',
    description: 'Heavy rains have completely washed out the western bridge on Route 4. Avoid until further notice.',
    timestamp: '12 hours ago',
    status: 'Unread',
    link: '/v/nairobi-trails/feed',
  },
  {
    id: 'u3',
    type: 'treasury',
    community: 'Global Mosaic Common',
    title: 'Quarterly Steward Stipends Distributed',
    description: '12,500 SCR was distributed across 45 active stewards.',
    timestamp: '2 days ago',
    status: 'Completed',
    link: '/treasury',
  }
];

const MOCK_SAVED_ITEMS = [
  {
    id: 's1',
    title: 'Best Practices for Archiving Oral History',
    type: 'Publication',
    author: 'Mosaic Research Guild',
    link: '/v/mosaic-guild/library',
  },
  {
    id: 's2',
    title: 'Draft: Trail Markers Standards',
    type: 'Project Draft',
    author: 'Nairobi Trail Runners',
    link: '/studio',
  }
];

// Delay to simulate network request
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));


// ============================================================================
// API IMPLEMENTATIONS (Commented out for future use)
// ============================================================================

/*
export const fetchActionItems = async () => {
  const res = await fetch('/api/user/action-items');
  if (!res.ok) throw new Error('Failed to fetch action items');
  return res.json();
};

export const fetchActiveProjects = async () => {
  const res = await fetch('/api/user/active-projects');
  if (!res.ok) throw new Error('Failed to fetch active projects');
  return res.json();
};

export const fetchCommunityUpdates = async () => {
  const res = await fetch('/api/user/community-updates');
  if (!res.ok) throw new Error('Failed to fetch community updates');
  return res.json();
};

export const fetchSavedItems = async () => {
  const res = await fetch('/api/user/saved-items');
  if (!res.ok) throw new Error('Failed to fetch saved items');
  return res.json();
};
*/


// ============================================================================
// REACT QUERY HOOKS (Using dummy data)
// ============================================================================

export const useGetActionItems = () => {
  return useXQuery({
    queryKey: ['homeActionItems'],
    queryFn: async () => {
      await delay(600);
      return MOCK_ACTION_ITEMS;
    }
  });
};

export const useGetActiveProjects = () => {
  return useXQuery({
    queryKey: ['homeActiveProjects'],
    queryFn: async () => {
      await delay(800);
      return MOCK_ACTIVE_PROJECTS;
    }
  });
};

export const useGetCommunityUpdates = () => {
  return useXQuery({
    queryKey: ['homeCommunityUpdates'],
    queryFn: async () => {
      await delay(1000);
      return MOCK_COMMUNITY_UPDATES;
    }
  });
};

export const useGetSavedItems = () => {
  return useXQuery({
    queryKey: ['homeSavedItems'],
    queryFn: async () => {
      await delay(500);
      return MOCK_SAVED_ITEMS;
    }
  });
};

import { useXQuery } from "@/lib/extended-react-query";

// ============================================================================
// TYPES
// ============================================================================

export interface ExploreItem {
  id: string;
  type: 'collaboration' | 'publication' | 'community' | 'project' | 'residency' | 'collection' | 'funded';
  title: string;
  description: string;
  communityId: string;
  communityName: string;
  topic: 'Literary Arts' | 'Visual Arts' | 'Music & Audio' | 'Exploration' | 'Knowledge' | 'Technology' | 'Ecology';
  location: string; // Dynamic string instead of hardcoded cities
  size: 'Small' | 'Medium' | 'Large';
  visibility: 'Public Common' | 'Gated Circle' | 'Shared Space';
  activityLevel: 'Active Hearth' | 'Emerging' | 'Quiet Archive';
  format: 'Written Essay' | 'Photo Series' | 'Audio Transcript' | 'Interactive Map' | 'Code Repository' | 'Cohort Program';
  language: 'English' | 'Yoruba' | 'Swahili' | 'French' | 'Twi' | 'Wolof';
  details: {
    partners?: string[];
    author?: string;
    curator?: string;
    membersCount?: number;
    stipend?: string;
    fundingAmount?: string;
    rolesNeeded?: string[];
    duration?: string;
    deadline?: string;
    publishedDate?: string;
    totalArtifacts?: number;
    dateApproved?: string;
    votersCount?: number;
    applicationsOpen?: boolean;
    activeSince?: string;
  };
}

// ============================================================================
// DUMMY DATASET
// ============================================================================

export const MOCK_EXPLORE_ITEMS: ExploreItem[] = [
  // Trending Collaborations
  {
    id: 'collab-1',
    type: 'collaboration',
    title: 'Decentralized Archival Protocol',
    description: 'A joint initiative between Scribes of the Sahel and Syntactic Weavers to build resilient, local-first archiving servers.',
    communityId: 'scribes-of-sahel',
    communityName: 'The Scribes of the Sahel',
    topic: 'Technology',
    location: 'Senegal',
    size: 'Medium',
    visibility: 'Public Common',
    activityLevel: 'Active Hearth',
    format: 'Code Repository',
    language: 'English',
    details: {
      partners: ['Syntactic Weavers', 'The Scribes of the Sahel'],
      duration: 'Ongoing',
      votersCount: 42
    }
  },
  {
    id: 'collab-2',
    type: 'collaboration',
    title: 'Spoken Word Synthesis',
    description: 'Lagos Poetry Circle and Abuja Sound Lab collaborating to merge traditional oral poetry with modern ambient field recordings.',
    communityId: 'lagos-poetry',
    communityName: 'Lagos Poetry Circle',
    topic: 'Music & Audio',
    location: 'Nigeria',
    size: 'Medium',
    visibility: 'Shared Space',
    activityLevel: 'Emerging',
    format: 'Audio Transcript',
    language: 'English',
    details: {
      partners: ['Lagos Poetry Circle', 'Abuja Sound Lab'],
      duration: '3 Months',
      votersCount: 28
    }
  },
  {
    id: 'collab-3',
    type: 'collaboration',
    title: 'Traditional Weaver Registry',
    description: 'A collaborative repository documenting and tracing pattern signatures of Kente weavers across West Africa.',
    communityId: 'syntactic-weavers',
    communityName: 'Syntactic Weavers',
    topic: 'Knowledge',
    location: 'Ghana',
    size: 'Large',
    visibility: 'Public Common',
    activityLevel: 'Active Hearth',
    format: 'Code Repository',
    language: 'English',
    details: {
      partners: ['Syntactic Weavers', 'Ghana Weaving Guild'],
      duration: 'Ongoing',
      votersCount: 37
    }
  },
  {
    id: 'collab-4',
    type: 'collaboration',
    title: 'Swahili Sound Preservation',
    description: 'A combined cataloging effort recording acoustic properties of historical stone towns and sea vessels along the coast.',
    communityId: 'nairobi-trails',
    communityName: 'Nairobi Hiking Club',
    topic: 'Music & Audio',
    location: 'Kenya',
    size: 'Medium',
    visibility: 'Shared Space',
    activityLevel: 'Emerging',
    format: 'Audio Transcript',
    language: 'Swahili',
    details: {
      partners: ['Nairobi Hiking Club', 'Mombasa Audio Collective'],
      duration: '6 Months',
      votersCount: 19
    }
  },

  // New Publications
  {
    id: 'pub-1',
    type: 'publication',
    title: 'On the Ethics of Digital Archives',
    description: 'An extensive essay exploring the moral duties of digitizing fragile oral memories that were originally meant to fade with time.',
    communityId: 'neo-classical-agora',
    communityName: 'Neo-Classical Agora',
    topic: 'Knowledge',
    location: 'Remote',
    size: 'Large',
    visibility: 'Public Common',
    activityLevel: 'Quiet Archive',
    format: 'Written Essay',
    language: 'English',
    details: {
      author: 'Kofi Mensah',
      publishedDate: '3 days ago',
      totalArtifacts: 1
    }
  },
  {
    id: 'pub-2',
    type: 'publication',
    title: 'Urban Soundscapes of West Africa',
    description: 'A comprehensive collection of field recordings and sound maps documenting historical city markets.',
    communityId: 'scribes-of-sahel',
    communityName: 'The Scribes of the Sahel',
    topic: 'Music & Audio',
    location: 'Nigeria',
    size: 'Medium',
    visibility: 'Public Common',
    activityLevel: 'Active Hearth',
    format: 'Audio Transcript',
    language: 'French',
    details: {
      author: 'Amina Diallo',
      publishedDate: '1 week ago',
      totalArtifacts: 15
    }
  },
  {
    id: 'pub-3',
    type: 'publication',
    title: 'The Architecture of Mud Mosques',
    description: 'A spatial history essay analyzing the thermal properties and community maintenance rituals of earthen structures in Mali.',
    communityId: 'scribes-of-sahel',
    communityName: 'The Scribes of the Sahel',
    topic: 'Ecology',
    location: 'Remote',
    size: 'Medium',
    visibility: 'Public Common',
    activityLevel: 'Quiet Archive',
    format: 'Written Essay',
    language: 'French',
    details: {
      author: 'Idrissa Keita',
      publishedDate: '2 weeks ago',
      totalArtifacts: 3
    }
  },
  {
    id: 'pub-4',
    type: 'publication',
    title: 'Oral Lineages of the Volta Basin',
    description: 'An annotated anthology of songs and chants commemorating historic migrations and ecological markers.',
    communityId: 'neo-classical-agora',
    communityName: 'Neo-Classical Agora',
    topic: 'Literary Arts',
    location: 'Ghana',
    size: 'Large',
    visibility: 'Public Common',
    activityLevel: 'Quiet Archive',
    format: 'Written Essay',
    language: 'English',
    details: {
      author: 'Ama Osei',
      publishedDate: '5 days ago',
      totalArtifacts: 1
    }
  },

  // Nearby Communities
  {
    id: 'comm-1',
    type: 'community',
    title: 'Lagos Poetry Circle',
    description: 'A collective of local writers, poets, and sound curators mapping the oral history of Lagos mainland.',
    communityId: 'lagos-poetry',
    communityName: 'Lagos Poetry Circle',
    topic: 'Literary Arts',
    location: 'Nigeria',
    size: 'Medium',
    visibility: 'Public Common',
    activityLevel: 'Active Hearth',
    format: 'Audio Transcript',
    language: 'English',
    details: {
      membersCount: 124,
      activeSince: 'Jan 2024'
    }
  },
  {
    id: 'comm-2',
    type: 'community',
    title: 'Nairobi Hiking Club',
    description: 'A community mapping the trails, plant species, and bird migration patterns of the Rift Valley.',
    communityId: 'nairobi-trails',
    communityName: 'Nairobi Hiking Club',
    topic: 'Exploration',
    location: 'Kenya',
    size: 'Medium',
    visibility: 'Public Common',
    activityLevel: 'Active Hearth',
    format: 'Interactive Map',
    language: 'Swahili',
    details: {
      membersCount: 89,
      activeSince: 'Nov 2023'
    }
  },
  {
    id: 'comm-3',
    type: 'community',
    title: 'Dakar Clay Artisans',
    description: 'A digital guild of potters and sculptors sharing kiln designs and clay-sourcing maps.',
    communityId: 'scribes-of-sahel',
    communityName: 'The Scribes of the Sahel',
    topic: 'Visual Arts',
    location: 'Senegal',
    size: 'Small',
    visibility: 'Public Common',
    activityLevel: 'Active Hearth',
    format: 'Photo Series',
    language: 'French',
    details: {
      membersCount: 54,
      activeSince: 'Mar 2024'
    }
  },
  {
    id: 'comm-4',
    type: 'community',
    title: 'Ibadan Historical Archives',
    description: 'A local student-led club digitization collective preserving early 20th-century family photography collections.',
    communityId: 'neo-classical-agora',
    communityName: 'Neo-Classical Agora',
    topic: 'Knowledge',
    location: 'Nigeria',
    size: 'Medium',
    visibility: 'Public Common',
    activityLevel: 'Emerging',
    format: 'Photo Series',
    language: 'English',
    details: {
      membersCount: 72,
      activeSince: 'Sep 2023'
    }
  },

  // Open Projects
  {
    id: 'proj-1',
    type: 'project',
    title: 'Yoruba Translation Cycle',
    description: 'Translating ancient historical legal records and royal lineage poems into modern Yoruba poetry and accessible English transcripts.',
    communityId: 'scribes-of-sahel',
    communityName: 'The Scribes of the Sahel',
    topic: 'Literary Arts',
    location: 'Nigeria',
    size: 'Medium',
    visibility: 'Public Common',
    activityLevel: 'Active Hearth',
    format: 'Written Essay',
    language: 'Yoruba',
    details: {
      rolesNeeded: ['Poetic Translator', 'Language Steward'],
      deadline: 'June 30, 2026'
    }
  },
  {
    id: 'proj-2',
    type: 'project',
    title: 'Visual Mapping of Historic Subeats',
    description: 'A collective mapping project to photograph and annotate rapidly fading historical structures in coastal Accra.',
    communityId: 'scribes-of-sahel',
    communityName: 'The Scribes of the Sahel',
    topic: 'Visual Arts',
    location: 'Ghana',
    size: 'Small',
    visibility: 'Shared Space',
    activityLevel: 'Emerging',
    format: 'Photo Series',
    language: 'English',
    details: {
      rolesNeeded: ['Photographer', 'GIS Cataloger'],
      deadline: 'Aug 15, 2026'
    }
  },
  {
    id: 'proj-3',
    type: 'project',
    title: 'Adinkra Symbol Cataloging',
    description: 'A community-led data collection drive to index Adinkra cloth patterns and log their historical definitions.',
    communityId: 'syntactic-weavers',
    communityName: 'Syntactic Weavers',
    topic: 'Visual Arts',
    location: 'Ghana',
    size: 'Medium',
    visibility: 'Public Common',
    activityLevel: 'Active Hearth',
    format: 'Photo Series',
    language: 'English',
    details: {
      rolesNeeded: ['Data Collector', 'Cultural Historian'],
      deadline: 'Oct 1, 2026'
    }
  },
  {
    id: 'proj-4',
    type: 'project',
    title: 'Ethnobotanical Audio Logs',
    description: 'Recording oral guides from elders on local plant properties, uses, and traditional harvesting calendar dates.',
    communityId: 'nairobi-trails',
    communityName: 'Nairobi Hiking Club',
    topic: 'Ecology',
    location: 'Kenya',
    size: 'Small',
    visibility: 'Public Common',
    activityLevel: 'Active Hearth',
    format: 'Audio Transcript',
    language: 'Swahili',
    details: {
      rolesNeeded: ['Audio Editor', 'Botanist'],
      deadline: 'Dec 15, 2026'
    }
  },

  // Creative Residencies
  {
    id: 'res-1',
    type: 'residency',
    title: 'Sahelian Scribe Residency',
    description: 'A six-week funded residency in Dakar for visual artists and historians to study traditional clay and poetry patterns.',
    communityId: 'scribes-of-sahel',
    communityName: 'The Scribes of the Sahel',
    topic: 'Visual Arts',
    location: 'Senegal',
    size: 'Small',
    visibility: 'Shared Space',
    activityLevel: 'Emerging',
    format: 'Cohort Program',
    language: 'French',
    details: {
      stipend: '5,000 SCR',
      duration: '6 Weeks',
      applicationsOpen: true
    }
  },
  {
    id: 'res-2',
    type: 'residency',
    title: 'Echoes of the Forest Cohort',
    description: 'A creative gathering in the outskirts of Nairobi, focused on recording eco-acoustic data and botanical history.',
    communityId: 'nairobi-trails',
    communityName: 'Nairobi Hiking Club',
    topic: 'Ecology',
    location: 'Kenya',
    size: 'Small',
    visibility: 'Shared Space',
    activityLevel: 'Active Hearth',
    format: 'Cohort Program',
    language: 'Swahili',
    details: {
      stipend: '3,500 SCR',
      duration: '4 Weeks',
      applicationsOpen: true
    }
  },
  {
    id: 'res-3',
    type: 'residency',
    title: 'Earthen Building Fellowship',
    description: 'An intensive fellowship in Accra focusing on building techniques using local red clay and palm fibers.',
    communityId: 'scribes-of-sahel',
    communityName: 'The Scribes of the Sahel',
    topic: 'Ecology',
    location: 'Ghana',
    size: 'Small',
    visibility: 'Shared Space',
    activityLevel: 'Emerging',
    format: 'Cohort Program',
    language: 'English',
    details: {
      stipend: '4,000 SCR',
      duration: '8 Weeks',
      applicationsOpen: true
    }
  },
  {
    id: 'res-4',
    type: 'residency',
    title: 'Highlife Sound Archiving Lab',
    description: 'A three-month laboratory in Lagos for young audiophiles to catalog and digitize historic 70s vinyl tapes.',
    communityId: 'lagos-poetry',
    communityName: 'Lagos Poetry Circle',
    topic: 'Music & Audio',
    location: 'Nigeria',
    size: 'Medium',
    visibility: 'Shared Space',
    activityLevel: 'Active Hearth',
    format: 'Cohort Program',
    language: 'English',
    details: {
      stipend: '6,000 SCR',
      duration: '12 Weeks',
      applicationsOpen: false
    }
  },

  // Community Collections
  {
    id: 'coll-1',
    type: 'collection',
    title: 'Timbuktu Manuscript Imagery',
    description: 'High-resolution digital archive of 14th-century scientific and astronomical treatises, cataloged for educational research.',
    communityId: 'scribes-of-sahel',
    communityName: 'The Scribes of the Sahel',
    topic: 'Knowledge',
    location: 'Remote',
    size: 'Large',
    visibility: 'Gated Circle',
    activityLevel: 'Quiet Archive',
    format: 'Photo Series',
    language: 'French',
    details: {
      totalArtifacts: 48,
      curator: 'Amina Diallo'
    }
  },
  {
    id: 'coll-2',
    type: 'collection',
    title: 'Swahili Coast Maritime Lore',
    description: 'A structured archive of traditional dhow construction diagrams, sailors chants, and seasonal tide calendars.',
    communityId: 'nairobi-trails',
    communityName: 'Nairobi Hiking Club',
    topic: 'Exploration',
    location: 'Remote',
    size: 'Medium',
    visibility: 'Public Common',
    activityLevel: 'Quiet Archive',
    format: 'Interactive Map',
    language: 'Swahili',
    details: {
      totalArtifacts: 32,
      curator: 'Juma Ramadhani'
    }
  },
  {
    id: 'coll-3',
    type: 'collection',
    title: 'Nok Terracotta 3D Scans',
    description: 'A public collection of high-fidelity photogrammetry scans documenting classical Nok culture figures.',
    communityId: 'lagos-poetry',
    communityName: 'Lagos Poetry Circle',
    topic: 'Visual Arts',
    location: 'Nigeria',
    language: 'English',
    size: 'Large',
    visibility: 'Public Common',
    activityLevel: 'Quiet Archive',
    format: 'Photo Series',
    details: {
      totalArtifacts: 24,
      curator: 'Chidi Okechukwu'
    }
  },
  {
    id: 'coll-4',
    type: 'collection',
    title: 'Giriama Funeral Post Imagery',
    description: 'A highly curated photo series and documentation detailing the wood carving techniques of Vigango posts.',
    communityId: 'nairobi-trails',
    communityName: 'Nairobi Hiking Club',
    topic: 'Knowledge',
    location: 'Kenya',
    language: 'Swahili',
    size: 'Medium',
    visibility: 'Public Common',
    activityLevel: 'Quiet Archive',
    format: 'Photo Series',
    details: {
      totalArtifacts: 18,
      curator: 'Juma Ramadhani'
    }
  },

  // Recently Funded
  {
    id: 'fund-1',
    type: 'funded',
    title: 'Sacred Sites Mapping Initiative',
    description: 'A community project mapping ancient spiritual groves and indigenous plant species, recently awarded a research stipend.',
    communityId: 'nairobi-trails',
    communityName: 'Nairobi Hiking Club',
    topic: 'Ecology',
    location: 'Kenya',
    size: 'Small',
    visibility: 'Public Common',
    activityLevel: 'Active Hearth',
    format: 'Interactive Map',
    language: 'Swahili',
    details: {
      fundingAmount: '12,000 SCR',
      dateApproved: 'May 20, 2026',
      votersCount: 89
    }
  },
  {
    id: 'fund-2',
    type: 'funded',
    title: 'Indigenous Language Scribes',
    description: 'Funding allocated to transcribe and preserve dying oral dialects in rural parts of Nigeria, using local elder narratives.',
    communityId: 'scribes-of-sahel',
    communityName: 'The Scribes of the Sahel',
    topic: 'Knowledge',
    location: 'Nigeria',
    size: 'Medium',
    visibility: 'Public Common',
    activityLevel: 'Active Hearth',
    format: 'Written Essay',
    language: 'Yoruba',
    details: {
      fundingAmount: '18,500 SCR',
      dateApproved: 'May 12, 2026',
      votersCount: 142
    }
  },
  {
    id: 'fund-3',
    type: 'funded',
    title: 'Griot Oral Epic Transcription',
    description: 'A transcription grant awarded to digitize 12 foundational epic poems performed in rural Senegal.',
    communityId: 'scribes-of-sahel',
    communityName: 'The Scribes of the Sahel',
    topic: 'Literary Arts',
    location: 'Senegal',
    size: 'Small',
    visibility: 'Public Common',
    activityLevel: 'Active Hearth',
    format: 'Written Essay',
    language: 'Wolof',
    details: {
      fundingAmount: '9,500 SCR',
      dateApproved: 'Apr 28, 2026',
      votersCount: 64
    }
  },
  {
    id: 'fund-4',
    type: 'funded',
    title: 'Decentralized Archiving Server Node',
    description: 'Funds allocated for setting up low-energy Raspberry Pi server nodes in community libraries across Accra.',
    communityId: 'syntactic-weavers',
    communityName: 'Syntactic Weavers',
    topic: 'Technology',
    location: 'Ghana',
    size: 'Small',
    visibility: 'Public Common',
    activityLevel: 'Active Hearth',
    format: 'Code Repository',
    language: 'English',
    details: {
      fundingAmount: '15,000 SCR',
      dateApproved: 'May 5, 2026',
      votersCount: 78
    }
  }
];

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// ============================================================================
// API IMPLEMENTATIONS (Commented out for future real server implementation)
// ============================================================================

/*
export const fetchExploreItems = async (filters: {
  search?: string;
  topic?: string;
  location?: string;
  size?: string;
  visibility?: string;
  activityLevel?: string;
  format?: string;
  language?: string;
}) => {
  const queryParams = new URLSearchParams(filters as Record<string, string>).toString();
  const res = await fetch(`/api/explore?${queryParams}`);
  if (!res.ok) throw new Error('Failed to fetch explore items');
  return res.json();
};

export const fetchCuratedExplore = async () => {
  const res = await fetch('/api/explore/curated');
  if (!res.ok) throw new Error('Failed to fetch curated explore data');
  return res.json();
};

export const fetchExploreItem = async (id: string) => {
  const res = await fetch(`/api/explore/${id}`);
  if (!res.ok) throw new Error('Failed to fetch explore item');
  return res.json();
};
*/


// ============================================================================
// REACT QUERY HOOKS (Serving mock data with delay)
// ============================================================================

export interface ExploreFilters {
  search?: string;
  topic?: string;
  location?: string;
  size?: string;
  visibility?: string;
  activityLevel?: string;
  format?: string;
  language?: string;
}

export const useGetExploreItems = (filters: ExploreFilters = {}) => {
  return useXQuery({
    queryKey: ['exploreItems', filters],
    queryFn: async () => {
      await delay(600); // Simulate network latency

      let items = [...MOCK_EXPLORE_ITEMS];

      // Apply search query (title, description, communityName)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        items = items.filter(
          item =>
            item.title.toLowerCase().includes(searchLower) ||
            item.description.toLowerCase().includes(searchLower) ||
            item.communityName.toLowerCase().includes(searchLower)
        );
      }

      // Apply exact filters if selected
      if (filters.topic) {
        items = items.filter(item => item.topic === filters.topic);
      }
      if (filters.location) {
        items = items.filter(item => item.location.toLowerCase() === filters.location?.toLowerCase());
      }
      if (filters.size) {
        items = items.filter(item => item.size === filters.size);
      }
      if (filters.visibility) {
        items = items.filter(item => item.visibility === filters.visibility);
      }
      if (filters.activityLevel) {
        items = items.filter(item => item.activityLevel === filters.activityLevel);
      }
      if (filters.format) {
        items = items.filter(item => item.format === filters.format);
      }
      if (filters.language) {
        items = items.filter(item => item.language === filters.language);
      }

      return items;
    }
  });
};

export const useGetCuratedExplore = () => {
  return useXQuery({
    queryKey: ['exploreCurated'],
    queryFn: async () => {
      await delay(700);

      // Group items by type to form curated categories
      const items = MOCK_EXPLORE_ITEMS;
      return {
        trendingCollaborations: items.filter(i => i.type === 'collaboration'),
        newPublications: items.filter(i => i.type === 'publication'),
        nearbyCommunities: items.filter(i => i.type === 'community'),
        openProjects: items.filter(i => i.type === 'project'),
        creativeResidencies: items.filter(i => i.type === 'residency'),
        communityCollections: items.filter(i => i.type === 'collection'),
        recentlyFunded: items.filter(i => i.type === 'funded')
      };
    }
  });
};

export const useGetExploreItem = (id: string | null) => {
  return useXQuery({
    queryKey: ['exploreItem', id],
    queryFn: async () => {
      if (!id) return null;
      await delay(300);
      return MOCK_EXPLORE_ITEMS.find(item => item.id === id) || null;
    },
    enabled: !!id
  });
};

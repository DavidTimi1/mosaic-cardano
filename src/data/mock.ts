export const MOCK_HOME_ACTION_ITEMS = [
  {
    id: 'a1',
    type: 'INVITE',
    title: 'Invitation to Collaborate',
    description: 'You have been invited to join the "Nairobi Trail Runners" core mapping team.',
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    source: 'INVITE',
    link: '/inbox',
  },
  {
    id: 'a2',
    type: 'PROJECT_UPDATE',
    title: 'Pending Artifact Review',
    description: 'Amina D. requested your review on "Chapter 4: The Savannah Routes".',
    timestamp: Date.now() - 5 * 60 * 60 * 1000,
    source: 'PROJECT_UPDATE',
    link: '/studio',
  },
] as const;

export const MOCK_HOME_ACTIVE_PROJECTS = [
  {
    id: 'p1',
    title: 'Savannah Chronicles',
    community: 'Nairobi Trail Runners',
    description: 'Documenting the hidden trail routes through the eastern savannah.',
    progress: 65,
    lastActivityAt: Date.now() - 3 * 60 * 60 * 1000,
    collaborators: ['You', 'Amina D.', 'Kofi M.'],
    link: '/studio',
  },
  {
    id: 'p2',
    title: 'Lagos Poetry Anthology Volume II',
    community: 'Lagos Poetry Collective',
    description: 'Curating the second volume of modern spoken word transcripts.',
    progress: 30,
    lastActivityAt: Date.now() - 6 * 60 * 60 * 1000,
    collaborators: ['You', 'Oluwaseun B.'],
    link: '/studio',
  },
] as const;

export const MOCK_HOME_COMMUNITY_UPDATES = [
  {
    id: 'u1',
    type: 'governance',
    community: 'Lagos Poetry Collective',
    title: 'Vote: Allocate 5,000 SCR for the Annual Recital',
    description: 'Proposal to use treasury funds to secure the venue for next month\'s event.',
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
    status: 'Active (Ends in 2 days)',
    link: '/v/lagos-poetry/governance',
  },
  {
    id: 'u2',
    type: 'discussion',
    community: 'Nairobi Trail Runners',
    title: 'Urgent: Route 4 Washout',
    description: 'Heavy rains have completely washed out the western bridge on Route 4. Avoid until further notice.',
    timestamp: Date.now() - 12 * 60 * 60 * 1000,
    status: 'Unread',
    link: '/v/nairobi-trails/feed',
  },
  {
    id: 'u3',
    type: 'treasury',
    community: 'Global Mosaic Common',
    title: 'Quarterly Steward Stipends Distributed',
    description: '12,500 SCR was distributed across 45 active stewards.',
    timestamp: Date.now() - 48 * 60 * 60 * 1000,
    status: 'Completed',
    link: '/treasury',
  },
] as const;

export const MOCK_HOME_SAVED_ITEMS = [
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
  },
] as const;

export const MOCK_FEATURED_VILLAGE_CARDS = [
  { id: 'scribes-of-sahel', name: 'The Scribes of the Sahel', desc: 'Archiving West African oral histories and translated poetry.', members: 142, icon: '📜' },
  { id: 'syntactic-weavers', name: 'Syntactic Weavers', desc: 'A guild of open-source developers building decentralized primitives.', members: 89, icon: '⚡' },
  { id: 'neo-classical-agora', name: 'Neo-Classical Agora', desc: 'Philosophers and essayists discussing the intersection of tech and ethics.', members: 314, icon: '🏛️' },
];

export const MOCK_MY_VILLAGES = [
  {
    id: 'scribes-of-sahel',
    name: 'The Scribes of the Sahel',
    description: 'A digital settlement dedicated to archiving the oral histories and poetry of West Africa.',
    profileImageUrl: null,
    memberCount: 142,
    icon: '📜',
  },
  {
    id: 'syntactic-weavers',
    name: 'Syntactic Weavers',
    description: 'A guild of open-source developers building decentralized primitives.',
    profileImageUrl: null,
    memberCount: 89,
    icon: '⚡',
  },
];

export const MOCK_VILLAGE_DETAILS: Record<string, {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  treasuryBalance: string;
  isMember: boolean;
}> = {
  'scribes-of-sahel': {
    id: 'scribes-of-sahel',
    name: 'The Scribes of the Sahel',
    description: 'A digital settlement dedicated to archiving the oral histories and poetry of West Africa.',
    memberCount: 142,
    treasuryBalance: '45,000 SCR',
    isMember: true,
  },
};

export const MOCK_VILLAGE_PROJECTS = [
  {
    id: '1',
    title: 'West African Oral History Archive',
    description: 'A cumulative effort to digitize and preserve the oral lineages of the Niger River basin elders.',
    progress: 74,
    contributors: 15,
  },
  {
    id: '2',
    title: 'Poetry Translation Cycle',
    description: 'Iterative translations of the \'Timbuktu Manuscripts\' poetry into modern French and English.',
    progress: 42,
    contributors: 7,
  },
];

export const MOCK_VILLAGE_STREAM = [
  {
    id: '1',
    author: 'Amina Diallo',
    topic: 'On Archive Ethics',
    timeAgo: '2 hours ago',
    content: 'I’ve been reflecting on the permissions for the Songhai genealogy records. Should we consider a gated tier for specific family lineages, or maintain the open common mandate?',
    contributions: 8,
    lastUpdated: '12m ago',
  },
  {
    id: '2',
    author: 'Kofi Mensah',
    topic: 'Technical Mapping',
    timeAgo: '5 hours ago',
    content: 'The metadata schema for the pottery shards is now live in the Studio. Please review the \'Spatial Anchors\' section before we finalize the commit.',
    contributions: 3,
    lastUpdated: null,
  },
] as const;

export const MOCK_VILLAGE_NEEDS = [
  { id: '1', role: 'Yoruba Translator', project: 'Oral Histories' },
  { id: '2', role: 'Archival Mentor', project: 'Village Onboarding' },
  { id: '3', role: 'GIS Mapping Lead', project: 'Sacred Sites' },
] as const;

export const MOCK_VILLAGE_TIMELINE = [
  { id: '1', date: 'August, 2023', title: 'The Great Confluence', description: 'First gathering of Sahelian scribes in the digital settlement. 42 founding members established the ethical charter.', dotColor: 'bg-theme-accent' },
  { id: '2', date: 'April, 2023', title: 'First Fragment Cataloged', description: 'The initial digital record of the Gao manuscripts was successfully archived.', dotColor: 'bg-theme-outline' },
  { id: '3', date: 'December, 2022', title: 'Settlement Foundation', description: 'The architecture of \'The Scribes of the Sahel\' was carved into the Village Layer.', dotColor: 'bg-theme-outline' },
] as const;

export const MOCK_FEATURED_ARTIFACTS = [
  { id: '1', title: "The Griot's Echo", community: 'Scribes of the Sahel', type: 'Poetry', description: 'An epic poem transcribed collaboratively by 15 scholars over 3 months, translating ancient dialects into a unified digital volume.' },
  { id: '2', title: 'Protocol Governance Draft v2', community: 'Syntactic Weavers', type: 'Technical', description: 'The foundational draft for the decentralized node architecture, outlining consensus rules and penalty slashing for bad actors.' },
  { id: '3', title: 'On the Ethics of Archives', community: 'Neo-Classical Agora', type: 'Essay', description: 'A profound essay discussing the moral implications of digitizing artifacts that were originally meant to decay.' },
  { id: '4', title: 'Sahara Topography Maps', community: 'Scribes of the Sahel', type: 'Visual', description: 'High-resolution geospatial data mapping the shifting dunes over the past two decades, crucial for historical preservation.' },
  { id: '5', title: 'Zero-Knowledge Rollup Spec', community: 'Syntactic Weavers', type: 'Technical', description: 'A detailed mathematical specification outlining the ZK circuit constraints for scaling transactions without compromising privacy.' },
] as const;

export const MOCK_VILLAGE_FEATURED_WORKS = [
  {
    id: 1,
    title: "The Griot's Echo: A Griot's Tale",
    desc: 'A collection of epic poems transcribed from the oral tradition of the Griot storytellers.',
    tags: ['Poetry', 'Oral History', 'West Africa'],
    contributors: 5,
  },
  {
    id: 2,
    title: 'Voices of the Diaspora',
    desc: 'Personal essays and interviews from community members living abroad, connecting roots with the present.',
    tags: ['Essays', 'Interviews', 'Diaspora'],
    contributors: 8,
  },
] as const;

export const MOCK_TREASURY_ALLOCATIONS = {
  balance: '45,000 SCR',
  recentAllocations: [
    { label: 'Mali Site Prep', amount: '-450' },
    { label: 'Steward Stipends', amount: '-1,200' },
  ],
};

export const MOCK_VILLAGE_MEMBERS = Array.from({ length: 13 }, (_, i) => ({
  id: String(i + 1),
  name: `Member ${i + 1}`,
  avatar: '',
}));

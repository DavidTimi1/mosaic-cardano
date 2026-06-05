import { z } from 'zod';

export const defaultUserSettings = {
  profile: {
    showBadges: true,
    showCommunities: true,
  },
  privacy: {
    discoverable: true,
    allowMessagesFrom: 'EVERYONE' as const,
  },
  feed: {
    autoplayMedia: true,
    defaultView: 'CARD' as const,
  },
  notifications: {
    pushEnabled: false,
    emailMentions: true,
    emailReplies: true,
    emailCommunityAlerts: true,
  },
};

export const UserSettingsSchema = z.object({
  profile: z.object({
    showBadges: z.boolean().default(true),
    showCommunities: z.boolean().default(true),
  }).default(defaultUserSettings.profile),
  privacy: z.object({
    discoverable: z.boolean().default(true),
    allowMessagesFrom: z.enum(['EVERYONE', 'NOBODY']).default('EVERYONE'),
  }).default(defaultUserSettings.privacy),
  feed: z.object({
    autoplayMedia: z.boolean().default(true),
    defaultView: z.enum(['CARD', 'COMPACT']).default('CARD'),
  }).default(defaultUserSettings.feed),
  notifications: z.object({
    pushEnabled: z.boolean().default(false),
    emailMentions: z.boolean().default(true),
    emailReplies: z.boolean().default(true),
    emailCommunityAlerts: z.boolean().default(true),
  }).default(defaultUserSettings.notifications),
});

export type UserSettings = z.infer<typeof UserSettingsSchema>;

'use client';

import { ProfilePageContent } from '@/components/profile/ProfilePageContent';
import { useGetAuthState } from '@/services/auth';

export default function ProfilePage() {
  const {data } = useGetAuthState();
  return <ProfilePageContent username={String(data?.user?.id)} />
}

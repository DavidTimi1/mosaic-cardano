
import { SettingsTab } from '@/components/settings/SettingsSidebar';
import dynamic from 'next/dynamic';

const SettingsView = dynamic(() => import('@/components/settings/SettingsView'), { ssr: false });

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const tab = params.tab as SettingsTab | undefined;
  
  return <SettingsView initialTab={tab} />;
}

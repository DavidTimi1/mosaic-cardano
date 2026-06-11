import SettingsView from '@/components/settings/SettingsView';
import { SettingsTab } from '@/components/settings/SettingsSidebar';

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const tab = params.tab as SettingsTab | undefined;
  
  return <SettingsView initialTab={tab} />;
}

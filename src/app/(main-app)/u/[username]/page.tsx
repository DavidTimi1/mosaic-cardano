import { ProfilePageContent } from "@/components/profile/ProfilePageContent";

export default async function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  const { username } = resolvedParams;

  return (
    <ProfilePageContent username={username} />
  )
}

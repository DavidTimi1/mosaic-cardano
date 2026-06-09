import React from 'react';
import { useGetVillageMembers } from '@/services/villages';
import { Loader2, Shield, MoreVertical } from 'lucide-react';

interface Props {
  communityId: string;
  isCreator: boolean;
}

export default function MemberManagement({ communityId, isCreator }: Props) {
  const { data: members, isLoading } = useGetVillageMembers(communityId);

  if (isLoading) {
    return <div className="py-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-theme-accent" /></div>;
  }

  if (!members || members.length === 0) {
    return <div className="py-8 text-center text-theme-on-surface/50">No members found.</div>;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-semibold text-theme-on-surface">Member Management</h2>
        <span className="text-sm font-sans text-theme-on-surface/60">{members.length} members</span>
      </div>

      <div className="bg-theme-surface border border-theme-outline/20 rounded-xl overflow-hidden">
        <div className="divide-y divide-theme-outline/10">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-4 hover:bg-theme-surface-raised/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-theme-accent/20 flex items-center justify-center font-semibold text-theme-accent">
                  {member.displayName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-theme-on-surface">{member.displayName}</p>
                  <p className="text-sm text-theme-on-surface/60 font-sans">User ID: {member.id.slice(0, 8)}...</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {member.role === 'ADMIN' && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-theme-accent/10 text-theme-accent text-xs font-semibold uppercase tracking-wider">
                    <Shield className="w-3.5 h-3.5" /> Creator
                  </span>
                )}
                {isCreator && member.role !== 'ADMIN' && (
                  <button className="p-2 text-theme-on-surface/40 hover:text-theme-on-surface hover:bg-theme-outline/10 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {!isCreator && (
        <p className="text-xs text-theme-on-surface/40 italic">Read-only: Only the creator can manage members.</p>
      )}
    </section>
  );
}

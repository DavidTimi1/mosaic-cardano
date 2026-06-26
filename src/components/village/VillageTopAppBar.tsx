"use client";
import React, { useEffect } from 'react';
import { Share, Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useShareInvite } from '@/services/villages';
import { useGetAuthState, useGetVillageMembership } from '@/services/auth';
import { toast } from 'sonner';
import { TopAppBarWrapper } from '../layout/TopAppBar';
import { Button } from '../ui/button';
import MosaicBrand from '../ui/icons/MosaicBrand';

export default function VillageTopAppBar({ children }: { children?: React.ReactNode }) {
  const params = useParams();
  const communityId = params.community_id as string;
  const { data: authState } = useGetAuthState();
  const { data: membership, isLoading: isLoadingMembership } = useGetVillageMembership(communityId);

  // const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { copyInvite, isGeneratingInvite, isError, error } = useShareInvite(communityId);
 
  const isMember = authState?.isAuthenticated && membership?.isMember;

  const handleShareInvite = async () => {
    const inviteUrl = await copyInvite();
    if (inviteUrl) {
      toast.success('Invite link copied to clipboard');
    }
  };

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || 'Failed to generate invite link');
    }
  }, [isError, error]);

  const leftContent = (
    <div className="flex items-center gap-6">
      {
        !isMember && (<MosaicBrand size="small" />)
      }
      
      {isLoadingMembership ? (
        <div className="h-6 w-48 bg-theme-outline/20 animate-pulse rounded"></div>
      ) : (
        <div className="flex items-center gap-4">
          {!isMember && (
            <button className="text-theme-accent font-sans text-[10px] uppercase tracking-widest font-bold hover:text-theme-forest transition-colors">
              Join Village
            </button>
          )}
        </div>
      )}
    </div>
  );

  const rightContent = (
    <div className="flex items-center gap-6 border-r border-theme-outline/20 pr-6 mr-2">
      {/* <div className="hidden md:flex items-center gap-4 relative">
        {isSearchOpen ? (
          <div className="flex items-center bg-theme-surface border border-theme-outline/30 rounded-lg px-3 py-1.5 animate-in fade-in slide-in-from-right-4">
            <Search size={16} className="text-theme-on-surface/50 mr-2" />
            <input
              type="text"
              placeholder="Search village..."
              className="bg-transparent border-none outline-none text-sm w-48"
              autoFocus
              onBlur={() => setIsSearchOpen(false)}
            />
          </div>
        ) : (
          <Search
            size={20}
            className="text-theme-on-surface/50 cursor-pointer hover:text-theme-forest transition-colors"
            onClick={() => setIsSearchOpen(true)}
          />
        )}
      </div> */}

      {isMember && (
        <Button
          variant="outline" 
          size="sm"
          onClick={handleShareInvite}
          disabled={isGeneratingInvite}
        >
          {isGeneratingInvite ? <Loader2 size={16} className="animate-spin" /> : <Share size={16} />}
          INVITE
        </Button>
      )}
    </div>
  );

  return (
    <TopAppBarWrapper leftContent={leftContent} rightContent={rightContent}>
      {children}
    </TopAppBarWrapper>
  );
}

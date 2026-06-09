"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { formatDistanceToNowStrict } from 'date-fns';
import { ArrowBigUp, ArrowBigDown, MessageSquare, Share2, CornerUpLeft, Loader2 } from 'lucide-react';
import { PostResponse } from '@/services/backend/post.service';
import { useVotePost, useGetPostReplies } from '@/services/posts';
import { cn } from '@/lib/utils';
import { useGetAuthState } from '@/services/auth';
import Link from 'next/link';
import { PostComposer } from './PostComposer';

interface PostCardProps {
  post: PostResponse;
  communityId: string;
  autoExpandDepth?: number;
  focusedChildId?: string;
  children?: React.ReactNode;
}

export function PostCard({ post, communityId, autoExpandDepth = 0, focusedChildId, children }: PostCardProps) {
  const { mutate: vote } = useVotePost(communityId);
  const { data: authState } = useGetAuthState();
  
  const [showComposer, setShowComposer] = useState(false);
  const [showReplies, setShowReplies] = useState(!!children);

  const { data: repliesData, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading: isLoadingReplies } = useGetPostReplies(post.id, showReplies || autoExpandDepth > 0);

  const fetchedReplies = repliesData?.pages.flatMap(p => p.items) || [];
  const replies = fetchedReplies.filter(r => r.id !== focusedChildId);

  const handleVote = (e: React.MouseEvent, direction: 'UP' | 'DOWN') => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!authState?.isAuthenticated) {
      return;
    }

    let newDirection: 'UP' | 'DOWN' | 'NONE' = direction;
    if (post.viewerVote === direction) {
      newDirection = 'NONE';
    }

    vote({ postId: post.id, direction: newDirection });
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const url = `${window.location.origin}/post/${post.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Post by ${post.author.name} on Mosaic`,
          text: post.content,
          url: url
        });
      } catch {
        // user aborted or failed
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const handleToggleReply = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowComposer(!showComposer);
  };

  const handleToggleReplies = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowReplies(!showReplies);
  };

  const timeAgo = formatDistanceToNowStrict(new Date(post.createdAt)) + ' ago';

  return (
    <div className="flex flex-col">
      <div className="flex gap-3 p-4 bg-theme-surface rounded-xl border border-theme-outline/20 hover:border-theme-outline/40 transition-colors shadow-sm cursor-pointer group">
        
        {/* Reddit-style Vertical Vote Strip */}
        <div className="flex flex-col items-center gap-1 shrink-0 bg-theme-surface-high p-1 rounded-full border border-theme-outline/10 self-start">
          <button 
            onClick={(e) => handleVote(e, 'UP')}
            className={cn(
              "p-1 rounded-full hover:bg-theme-outline/10 transition-colors",
              post.viewerVote === 'UP' ? "text-orange-500 bg-orange-500/10" : "text-theme-on-surface/50 hover:text-orange-500"
            )}
          >
            <ArrowBigUp size={20} className={cn(post.viewerVote === 'UP' && "fill-current")} />
          </button>
          
          <span className={cn(
            "text-xs font-bold font-mono",
            post.viewerVote === 'UP' ? "text-orange-500" : post.viewerVote === 'DOWN' ? "text-indigo-500" : "text-theme-on-surface/80"
          )}>
            {post.score}
          </span>
          
          <button 
            onClick={(e) => handleVote(e, 'DOWN')}
            className={cn(
              "p-1 rounded-full hover:bg-theme-outline/10 transition-colors",
              post.viewerVote === 'DOWN' ? "text-indigo-500 bg-indigo-500/10" : "text-theme-on-surface/50 hover:text-indigo-500"
            )}
          >
            <ArrowBigDown size={20} className={cn(post.viewerVote === 'DOWN' && "fill-current")} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link href={`/u/${post.author.username}`} className="flex items-center gap-2 group/author shrink-0 z-10" onClick={(e) => e.stopPropagation()}>
              <div className="w-5 h-5 rounded-full overflow-hidden bg-theme-clay flex items-center justify-center shrink-0">
                {post.author.avatarUrl ? (
                  <Image src={post.author.avatarUrl} alt={post.author.name} width={20} height={20} className="object-cover w-full h-full" unoptimized />
                ) : (
                  <span className="text-[10px] text-white font-bold">{post.author.name.charAt(0)}</span>
                )}
              </div>
              <span className="font-bold text-sm text-theme-forest group-hover/author:underline truncate">{post.author.name}</span>
            </Link>
            <span className="text-xs text-theme-on-surface/50 truncate shrink">@{post.author.username}</span>
            <span className="text-xs text-theme-on-surface/40 shrink-0">•</span>
            <span className="text-xs text-theme-on-surface/50 shrink-0">{timeAgo}</span>
          </div>

          <p className="text-theme-on-surface/90 text-sm whitespace-pre-wrap break-words leading-relaxed">
            {post.content}
          </p>

          {/* Action Bar */}
          <div className="flex items-center gap-6 mt-3">
            <button 
              onClick={handleToggleReplies}
              className={cn(
                "flex items-center gap-1.5 text-theme-on-surface/50 hover:text-theme-accent transition-colors text-xs font-sans font-bold group/btn z-10",
                showReplies && "text-theme-accent"
              )}
            >
              <div className="p-1.5 rounded-full group-hover/btn:bg-theme-accent/10 transition-colors">
                <MessageSquare size={16} />
              </div>
              {post.replyCount > 0 && post.replyCount}
            </button>

            <button 
              onClick={handleToggleReply}
              className={cn(
                "flex items-center gap-1.5 text-theme-on-surface/50 hover:text-theme-accent transition-colors text-xs font-sans font-bold group/btn z-10",
                showComposer && "text-theme-accent"
              )}
            >
              <div className="p-1.5 rounded-full group-hover/btn:bg-theme-accent/10 transition-colors">
                <CornerUpLeft size={16} />
              </div>
              Reply
            </button>
            
            <button 
              onClick={handleShare}
              className="flex items-center gap-1.5 text-theme-on-surface/50 hover:text-theme-accent transition-colors text-xs font-sans font-bold group/btn z-10"
            >
              <div className="p-1.5 rounded-full group-hover/btn:bg-theme-accent/10 transition-colors">
                <Share2 size={16} />
              </div>
              Share
            </button>
          </div>
        </div>
      </div>

      {showComposer && (
        <div className="ml-8 mt-2 pl-4 border-l-2 border-theme-outline/20">
          <PostComposer 
            communityId={communityId} 
            replyToId={post.id} 
            isInline 
            onSuccessCallback={() => {
              setShowComposer(false);
              setShowReplies(true);
            }} 
          />
        </div>
      )}

      {showReplies && (
        <div className="ml-8 mt-2 pl-4 border-l-2 border-theme-outline/20 flex flex-col gap-2 relative">
          
          {children && (
            <div className="relative">
              <div className="absolute top-8 -left-4 w-4 h-0.5 bg-theme-outline/20"></div>
              {children}
            </div>
          )}

          {isLoadingReplies && post.replyCount > 0 ? (
            <div className="py-4 flex justify-center"><Loader2 className="animate-spin text-theme-accent" size={20} /></div>
          ) : replies.length > 0 ? (
            <>
              {replies.map(reply => (
                <div key={reply.id} className="relative">
                  {/* L-Shape visual connector */}
                  <div className="absolute top-8 -left-4 w-4 h-0.5 bg-theme-outline/20"></div>
                  <PostCard 
                    post={reply} 
                    communityId={communityId} 
                    autoExpandDepth={autoExpandDepth > 0 ? autoExpandDepth - 1 : 0} 
                  />
                </div>
              ))}
              {hasNextPage && (
                <button 
                  onClick={() => fetchNextPage()} 
                  disabled={isFetchingNextPage}
                  className="text-xs font-bold text-theme-accent hover:underline py-2 self-start ml-2 flex items-center gap-2"
                >
                  {isFetchingNextPage ? <Loader2 size={12} className="animate-spin" /> : 'Load More Replies'}
                </button>
              )}
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}

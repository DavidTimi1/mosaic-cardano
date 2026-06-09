import { useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useXQuery } from '@/lib/extended-react-query';
import { fetchAPI } from './api';
import { API } from '@/lib/api-routes';
import { PostResponse } from './backend/post.service';

export const useGetVillagePosts = (communityId: string) => {
  return useXQuery({
    queryKey: ['villagePosts', communityId],
    queryFn: async () => {
      const res = await fetchAPI(API.VILLAGE.POSTS(communityId));
      return (res as { items: PostResponse[] }).items;
    }
  });
};
export const useGetPostThread = (postId: string) => {
  return useXQuery({
    queryKey: ['postThread', postId],
    queryFn: async () => {
      const res = await fetchAPI(API.POSTS.DETAILS(postId));
      return (res as { items: PostResponse[] }).items;
    },
    enabled: !!postId,
  });
};

export const useGetPostReplies = (postId: string, isEnabled: boolean = true) => {
  return useInfiniteQuery({
    queryKey: ['postReplies', postId],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetchAPI(`${API.POSTS.REPLIES(postId)}?offset=${pageParam}&limit=10`);
      return res as { items: PostResponse[]; nextOffset: number | null };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    enabled: !!postId && isEnabled,
  });
};

export const useCreatePost = (communityId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ content, replyToId }: { content: string; replyToId?: string }) => {
      const res = await fetchAPI(API.VILLAGE.POSTS(communityId), {
        method: 'POST',
        data: { content, replyToId }
      });
      return (res as { item: PostResponse }).item;
    },
    onSuccess: (data, variables) => {
      if (variables.replyToId) {
        queryClient.invalidateQueries({ queryKey: ['postReplies', variables.replyToId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['villagePosts', communityId] });
      }
    }
  });
};

type VotePayload = {
  postId: string;
  direction: 'UP' | 'DOWN' | 'NONE';
};

export const useVotePost = (communityId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, direction }: VotePayload) => {
      const res = await fetchAPI(API.POSTS.VOTE(postId), {
        method: 'POST',
        data: { direction }
      });
      return res as { score: number, viewerVote: 'UP' | 'DOWN' | 'NONE' };
    },
    onMutate: async ({ postId, direction }) => {
      await queryClient.cancelQueries({ queryKey: ['villagePosts', communityId] });

      const previousPosts = queryClient.getQueryData<PostResponse[]>(['villagePosts', communityId]);

      // Optimistically update to the new value
      queryClient.setQueryData<PostResponse[]>(['villagePosts', communityId], old => {
        if (!old) return [];
        return old.map(post => {
          if (post.id === postId) {
            let newScore = post.score;
            
            // Revert previous vote impact
            if (post.viewerVote === 'UP') newScore -= 1;
            else if (post.viewerVote === 'DOWN') newScore += 1;

            // Apply new vote impact
            if (direction === 'UP') newScore += 1;
            else if (direction === 'DOWN') newScore -= 1;

            return { ...post, score: newScore, viewerVote: direction };
          }
          return post;
        });
      });

      return { previousPosts };
    },
    onError: (err, newVote, context) => {
      // Rollback on error
      if (context?.previousPosts) {
        queryClient.setQueryData(['villagePosts', communityId], context.previousPosts);
      }
    },
    onSettled: () => {
      // Refetch to catch any replies that were optimistically missed
      queryClient.invalidateQueries({ queryKey: ['villagePosts', communityId] });
      queryClient.invalidateQueries({ queryKey: ['postReplies'] });
    },
  });
};

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAPI } from './api';
import { toast } from 'sonner';

export const useSubmitFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ type, message, name, email }: { type: string; message: string; name?: string; email?: string }) => {
      const res = await fetchAPI('/api/feedback', {
        method: 'POST',
        data: { type, message, name, email }
      });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userBadges'] });
      toast.success('Thank you for your feedback!');
    },
    onError: () => {
      toast.error('Failed to submit feedback. Please try again.');
    }
  });
};

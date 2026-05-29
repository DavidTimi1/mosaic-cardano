import { useXQuery } from "@/lib/extended-react-query";
import { AuthStateResponseSchema, type AuthStateResponse } from "@/types/api";

export const useGetAuthState = () => {
  return useXQuery({
    queryKey: ['authState'],
    queryFn: async () => {
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      const payload = await res.json();
      return AuthStateResponseSchema.parse(payload) satisfies AuthStateResponse;
    }
  });
};

export const useGetVillageMembership = (communityId: string) => {
  return useXQuery({
    queryKey: ['villageMembership', communityId],
    queryFn: async () => {
      // TODO: Replace with actual API call to check if user is a member of the specific village
      // const res = await fetch(`/api/villages/${communityId}/membership`);
      // return res.json();

      return {
        isMember: false, // Hardcoded to false for now
        role: null,
      };
    }
  });
};

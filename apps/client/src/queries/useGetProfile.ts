import { useQuery } from '@tanstack/react-query';

import { AUTH_ROUTES } from '../constants/api-routes';
import type { ApiResponse } from '../types/api-types';
import type { UserProfile } from '../types/auth-types';
import apiClient, { unwrapResponse } from '../utils/api-client';

export function useGetProfile() {
  return useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<UserProfile>>(
        AUTH_ROUTES.PROFILE,
      );
      return unwrapResponse(response);
    },
    staleTime: 300000, // 5 minutes
  });
}

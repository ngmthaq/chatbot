import { useQuery } from '@tanstack/react-query';

import { AUTH_ROUTES } from '../constants/api-routes';
import type { Rbac } from '../types/admin-types';
import type { ApiResponse } from '../types/api-types';
import apiClient, { unwrapResponse } from '../utils/api-client';

export function useGetPermissions() {
  return useQuery({
    queryKey: ['auth', 'permissions'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Rbac[]>>(
        AUTH_ROUTES.RBAC,
      );
      return unwrapResponse(response);
    },
    staleTime: 300000, // 5 minutes
  });
}

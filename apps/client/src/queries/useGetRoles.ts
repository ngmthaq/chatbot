import { useQuery } from '@tanstack/react-query';

import { ROLES_ROUTES } from '../constants/api-routes';
import type { Role } from '../types/admin-types';
import type { ApiResponse } from '../types/api-types';
import apiClient, { unwrapResponse } from '../utils/api-client';

export function useGetRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Role[]>>(
        ROLES_ROUTES.BASE,
      );
      return unwrapResponse(response);
    },
  });
}

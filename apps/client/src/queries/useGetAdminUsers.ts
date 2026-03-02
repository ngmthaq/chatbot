import { useQuery } from '@tanstack/react-query';

import { ADMIN_ROUTES } from '../constants/api-routes';
import type { UserWithRole } from '../types/admin-types';
import type { PaginationQuery } from '../types/api-types';
import apiClient, { unwrapPaginatedResponse } from '../utils/api-client';

export function useGetAdminUsers(params?: PaginationQuery) {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: async () => {
      const response = await apiClient.get(ADMIN_ROUTES.USERS, { params });
      return unwrapPaginatedResponse<UserWithRole>(response);
    },
  });
}

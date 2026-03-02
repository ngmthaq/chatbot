import { useQuery } from '@tanstack/react-query';

import { RBAC_ROUTES } from '../constants/api-routes';
import type { Rbac } from '../types/admin-types';
import type { ApiResponse } from '../types/api-types';
import apiClient, { unwrapResponse } from '../utils/api-client';

export function useGetRbacPermissions(roleId?: number) {
  return useQuery({
    queryKey: ['rbac', 'permissions', roleId],
    queryFn: async () => {
      const url = roleId ? RBAC_ROUTES.BY_ROLE(roleId) : RBAC_ROUTES.BASE;
      const response = await apiClient.get<ApiResponse<Rbac[]>>(url);
      return unwrapResponse(response);
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ROLES_ROUTES } from '../constants/api-routes';
import type { CreateRoleDto, Role } from '../types/admin-types';
import type { ApiResponse } from '../types/api-types';
import apiClient, { unwrapResponse } from '../utils/api-client';
import { showSuccessToast } from '../utils/error-handler';

export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateRoleDto) => {
      const response = await apiClient.post<ApiResponse<Role>>(
        ROLES_ROUTES.BASE,
        data,
      );
      return unwrapResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      showSuccessToast('Role created successfully');
    },
  });
}

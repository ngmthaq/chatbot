import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ROLES_ROUTES } from '../constants/api-routes';
import type { UpdateRoleDto, Role } from '../types/admin-types';
import type { ApiResponse } from '../types/api-types';
import apiClient, { unwrapResponse } from '../utils/api-client';
import { showSuccessToast } from '../utils/error-handler';

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateRoleDto) => {
      const { id, ...payload } = data;
      const response = await apiClient.put<ApiResponse<Role>>(
        ROLES_ROUTES.ROLE(id),
        payload,
      );
      return unwrapResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      showSuccessToast('Role updated successfully');
    },
  });
}

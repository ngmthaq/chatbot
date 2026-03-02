import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { USERS_ROUTES } from '../constants/api-routes';
import type { UpdateUserDto, UserWithRole } from '../types/admin-types';
import type { ApiResponse } from '../types/api-types';
import apiClient, { unwrapResponse } from '../utils/api-client';
import { showSuccessToast } from '../utils/error-handler';

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (data: UpdateUserDto) => {
      const { id, ...payload } = data;
      const response = await apiClient.put<ApiResponse<UserWithRole>>(
        USERS_ROUTES.USER(id),
        payload,
      );
      return unwrapResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      showSuccessToast(t('admin:users.updated'));
    },
  });
}

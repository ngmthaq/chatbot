import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { USERS_ROUTES } from '../constants/api-routes';
import type { CreateUserDto, UserWithRole } from '../types/admin-types';
import type { ApiResponse } from '../types/api-types';
import apiClient, { unwrapResponse } from '../utils/api-client';
import { showSuccessToast } from '../utils/error-handler';

export function useCreateUser() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (data: CreateUserDto) => {
      const response = await apiClient.post<ApiResponse<UserWithRole>>(
        USERS_ROUTES.BASE,
        data,
      );
      return unwrapResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      showSuccessToast(t('admin:users.created'));
    },
  });
}

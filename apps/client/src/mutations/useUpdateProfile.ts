import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import { useTranslation } from 'react-i18next';

import { AUTH_ROUTES } from '../constants/api-routes';
import { userAtom } from '../stores/auth-store';
import type { ApiResponse } from '../types/api-types';
import type { User } from '../types/auth-types';
import apiClient, { unwrapResponse } from '../utils/api-client';
import { showSuccessToast } from '../utils/error-handler';

export interface UpdateProfileDto {
  name?: string;
  phone?: string;
  address?: string;
  gender?: string;
  dateOfBirth?: string;
}

export function useUpdateProfile() {
  const { t } = useTranslation('common');
  const setUser = useSetAtom(userAtom);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileDto) => {
      const response = await apiClient.patch<ApiResponse<User>>(
        AUTH_ROUTES.PROFILE,
        data,
      );
      return unwrapResponse(response);
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] });
      showSuccessToast(t('profile.updateSuccess'));
    },
  });
}

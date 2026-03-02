import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { AUTH_ROUTES } from '../constants/api-routes';
import type { ApiResponse } from '../types/api-types';
import type { RegisterDto } from '../types/auth-types';
import apiClient, { unwrapResponse } from '../utils/api-client';
import { showSuccessToast } from '../utils/error-handler';

export function useRegister() {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (data: RegisterDto) => {
      const response = await apiClient.post<ApiResponse<void>>(
        AUTH_ROUTES.REGISTER,
        data,
      );
      return unwrapResponse(response);
    },
    onSuccess: () => {
      showSuccessToast(t('auth:register.success'));
    },
  });
}

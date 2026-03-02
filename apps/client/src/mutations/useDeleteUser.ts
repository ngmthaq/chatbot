import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { USERS_ROUTES } from '../constants/api-routes';
import apiClient from '../utils/api-client';
import { showSuccessToast } from '../utils/error-handler';

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(USERS_ROUTES.USER(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      showSuccessToast(t('admin:users.deleted'));
    },
  });
}

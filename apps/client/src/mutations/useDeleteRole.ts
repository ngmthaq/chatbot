import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { ROLES_ROUTES } from '../constants/api-routes';
import apiClient from '../utils/api-client';
import { showSuccessToast } from '../utils/error-handler';

export function useDeleteRole() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(ROLES_ROUTES.ROLE(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      showSuccessToast(t('admin:roles.deleted'));
    },
  });
}

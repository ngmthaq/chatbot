import { useMutation } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';

import { userAtom, permissionsAtom } from '../stores/auth-store';
import { showSuccessToast } from '../utils/error-handler';
import { clearTokens } from '../utils/token-manager';

export function useLogout() {
  const setUser = useSetAtom(userAtom);
  const setPermissions = useSetAtom(permissionsAtom);

  return useMutation({
    mutationFn: async () => {
      // Clear tokens from storage
      clearTokens();
    },
    onSuccess: () => {
      // Clear user state
      setUser(null);
      setPermissions([]);

      showSuccessToast('Logged out successfully');

      // Redirect to login
      window.location.href = '/login';
    },
  });
}

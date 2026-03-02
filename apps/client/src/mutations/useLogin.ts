import { useMutation } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';

import { AUTH_ROUTES } from '../constants/api-routes';
import { userAtom, permissionsAtom } from '../stores/auth-store';
import type { Rbac } from '../types/admin-types';
import type { ApiResponse } from '../types/api-types';
import type { LoginDto, AuthTokens, UserProfile } from '../types/auth-types';
import apiClient, { unwrapResponse } from '../utils/api-client';
import { showSuccessToast } from '../utils/error-handler';
import { setTokens } from '../utils/token-manager';

export function useLogin() {
  const setUser = useSetAtom(userAtom);
  const setPermissions = useSetAtom(permissionsAtom);

  return useMutation({
    mutationFn: async (data: LoginDto) => {
      const response = await apiClient.post<ApiResponse<AuthTokens>>(
        AUTH_ROUTES.LOGIN,
        data,
      );
      return unwrapResponse(response);
    },
    onSuccess: async (tokens) => {
      // Store tokens
      setTokens(tokens.accessToken, tokens.refreshToken);

      // Fetch user profile
      const profileResponse = await apiClient.get<ApiResponse<UserProfile>>(
        AUTH_ROUTES.PROFILE,
      );
      const profile = unwrapResponse(profileResponse);
      setUser(profile);

      // Fetch permissions
      const permissionsResponse = await apiClient.get<ApiResponse<Rbac[]>>(
        AUTH_ROUTES.RBAC,
      );
      const permissions = unwrapResponse(permissionsResponse);
      setPermissions(permissions);

      showSuccessToast('Login successful');
    },
  });
}

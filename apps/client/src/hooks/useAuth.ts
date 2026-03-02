import { useAtom, useAtomValue } from 'jotai';

import {
  userAtom,
  isAuthenticatedAtom,
  permissionsAtom,
  authLoadingAtom,
  permissionsLoadedAtom,
} from '../stores/auth-store';
import type { Permission } from '../types/admin-types';
import { hasPermission } from '../utils/permissions';

export function useAuth() {
  const [user, setUser] = useAtom(userAtom);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const [permissions, setPermissions] = useAtom(permissionsAtom);
  const isLoading = useAtomValue(authLoadingAtom);
  const permissionsLoaded = useAtomValue(permissionsLoadedAtom);

  const checkPermission = (permission: Permission): boolean => {
    if (!permission || !permission.module || !permission.action) {
      return false;
    }
    return hasPermission(permissions, permission.module, permission.action);
  };

  const clearAuth = () => {
    setUser(null);
    setPermissions([]);
  };

  return {
    user,
    setUser,
    isAuthenticated,
    isLoading: isLoading || !permissionsLoaded,
    permissions,
    setPermissions,
    checkPermission,
    clearAuth,
  };
}

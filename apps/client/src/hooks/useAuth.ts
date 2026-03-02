import { useAtom, useAtomValue } from 'jotai';

import {
  userAtom,
  isAuthenticatedAtom,
  permissionsAtom,
} from '../stores/auth-store';
import type { Permission } from '../types/admin-types';
import { hasPermission } from '../utils/permissions';

export function useAuth() {
  const [user, setUser] = useAtom(userAtom);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const [permissions, setPermissions] = useAtom(permissionsAtom);

  const checkPermission = (permission: Permission): boolean => {
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
    isLoading: false, // TODO: Add proper loading state when fetching user
    permissions,
    setPermissions,
    checkPermission,
    hasPermission: checkPermission, // Alias for backwards compatibility
    clearAuth,
  };
}

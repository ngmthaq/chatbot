import { Module, Action } from '../constants/rbac-constants';
import type { Rbac } from '../types/admin-types';

export const hasPermission = (
  permissions: Rbac[],
  module: Module,
  action: Action,
): boolean => {
  if (!permissions || permissions.length === 0) {
    return false;
  }
  return permissions.some(
    (permission) =>
      String(permission.module) === String(module) &&
      String(permission.action) === String(action),
  );
};

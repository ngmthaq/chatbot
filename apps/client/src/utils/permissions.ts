import { Module, Action } from '../constants/rbac-constants';
import type { Rbac } from '../types/admin-types';

export const hasPermission = (
  permissions: Rbac[],
  module: Module,
  action: Action,
): boolean => {
  return permissions.some(
    (permission) =>
      permission.module === module && permission.action === action,
  );
};

export const hasAnyPermission = (
  permissions: Rbac[],
  checks: Array<{ module: Module; action: Action }>,
): boolean => {
  return checks.some((check) =>
    hasPermission(permissions, check.module, check.action),
  );
};

export const hasAllPermissions = (
  permissions: Rbac[],
  checks: Array<{ module: Module; action: Action }>,
): boolean => {
  return checks.every((check) =>
    hasPermission(permissions, check.module, check.action),
  );
};

export const filterByPermission = <T>(
  items: T[],
  permissions: Rbac[],
  requiredModule: Module,
  requiredAction: Action,
): T[] => {
  if (!hasPermission(permissions, requiredModule, requiredAction)) {
    return [];
  }
  return items;
};

export const getPermissionsByModule = (
  permissions: Rbac[],
  module: Module,
): Rbac[] => {
  return permissions.filter((permission) => permission.module === module);
};

export const getModuleActions = (
  permissions: Rbac[],
  module: Module,
): Action[] => {
  return permissions
    .filter((permission) => permission.module === module)
    .map((permission) => permission.action);
};

export const canAccessAdminPanel = (permissions: Rbac[]): boolean => {
  return hasPermission(permissions, Module.ADMIN, Action.READ);
};

export const canManageUsers = (permissions: Rbac[]): boolean => {
  return hasAnyPermission(permissions, [
    { module: Module.USERS, action: Action.CREATE },
    { module: Module.USERS, action: Action.UPDATE },
    { module: Module.USERS, action: Action.DELETE },
  ]);
};

export const canManageRoles = (permissions: Rbac[]): boolean => {
  return hasAnyPermission(permissions, [
    { module: Module.ROLES, action: Action.CREATE },
    { module: Module.ROLES, action: Action.UPDATE },
    { module: Module.ROLES, action: Action.DELETE },
  ]);
};

export const canManagePermissions = (permissions: Rbac[]): boolean => {
  return hasAnyPermission(permissions, [
    { module: Module.RBAC, action: Action.CREATE },
    { module: Module.RBAC, action: Action.UPDATE },
    { module: Module.RBAC, action: Action.DELETE },
  ]);
};

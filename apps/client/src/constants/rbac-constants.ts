import { Module, Action } from '../types/admin-types';

export { Module, Action };

export const MODULES = [
  Module.USERS,
  Module.RBAC,
  Module.ROLES,
  Module.CHAT,
  Module.DOCUMENTS,
  Module.ADMIN,
] as const;

export const ACTIONS = [
  Action.CREATE,
  Action.READ,
  Action.UPDATE,
  Action.DELETE,
  Action.IMPORT,
  Action.EXPORT,
  Action.LOCK_UNLOCK,
] as const;

export const MODULE_LABELS: Record<Module, string> = {
  [Module.USERS]: 'Users',
  [Module.RBAC]: 'Permissions',
  [Module.ROLES]: 'Roles',
  [Module.CHAT]: 'Chat',
  [Module.DOCUMENTS]: 'Documents',
  [Module.ADMIN]: 'Admin',
};

export const ACTION_LABELS: Record<Action, string> = {
  [Action.CREATE]: 'Create',
  [Action.READ]: 'Read',
  [Action.UPDATE]: 'Update',
  [Action.DELETE]: 'Delete',
  [Action.IMPORT]: 'Import',
  [Action.EXPORT]: 'Export',
  [Action.LOCK_UNLOCK]: 'Lock/Unlock',
};

// Default permissions for common roles
export const DEFAULT_USER_PERMISSIONS = [
  { module: Module.CHAT, action: Action.CREATE },
  { module: Module.CHAT, action: Action.READ },
  { module: Module.CHAT, action: Action.UPDATE },
  { module: Module.CHAT, action: Action.DELETE },
  { module: Module.DOCUMENTS, action: Action.CREATE },
  { module: Module.DOCUMENTS, action: Action.READ },
  { module: Module.DOCUMENTS, action: Action.DELETE },
];

export const DEFAULT_ADMIN_PERMISSIONS = [
  ...DEFAULT_USER_PERMISSIONS,
  { module: Module.ADMIN, action: Action.CREATE },
  { module: Module.ADMIN, action: Action.READ },
  { module: Module.ADMIN, action: Action.UPDATE },
  { module: Module.ADMIN, action: Action.DELETE },
  { module: Module.USERS, action: Action.CREATE },
  { module: Module.USERS, action: Action.READ },
  { module: Module.USERS, action: Action.UPDATE },
  { module: Module.USERS, action: Action.DELETE },
  { module: Module.USERS, action: Action.LOCK_UNLOCK },
  { module: Module.ROLES, action: Action.CREATE },
  { module: Module.ROLES, action: Action.READ },
  { module: Module.ROLES, action: Action.UPDATE },
  { module: Module.ROLES, action: Action.DELETE },
  { module: Module.RBAC, action: Action.CREATE },
  { module: Module.RBAC, action: Action.READ },
  { module: Module.RBAC, action: Action.UPDATE },
  { module: Module.RBAC, action: Action.DELETE },
];

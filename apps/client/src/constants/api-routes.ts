const BASE_API_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:9000';

export const AUTH_ROUTES = {
  LOGIN: `${BASE_API_URL}/api/auth/login`,
  REGISTER: `${BASE_API_URL}/api/auth/register`,
  REFRESH: `${BASE_API_URL}/api/auth/refresh`,
  ACTIVATE: (token: string) => `${BASE_API_URL}/api/auth/activate/${token}`,
  PROFILE: `${BASE_API_URL}/api/auth/profile`,
  ROLE: `${BASE_API_URL}/api/auth/role`,
  RBAC: `${BASE_API_URL}/api/auth/rbac`,
  FORGOT_PASSWORD: `${BASE_API_URL}/api/auth/password/forgot`,
  RESET_PASSWORD: `${BASE_API_URL}/api/auth/password/reset`,
} as const;

export const CHAT_ROUTES = {
  CONVERSATIONS: `${BASE_API_URL}/api/chat/conversations`,
  CONVERSATION: (id: number) => `${BASE_API_URL}/api/chat/conversations/${id}`,
  MESSAGES: (conversationId: number) =>
    `${BASE_API_URL}/api/chat/conversations/${conversationId}/messages`,
  ARCHIVE: (id: number) =>
    `${BASE_API_URL}/api/chat/conversations/${id}/archive`,
} as const;

export const DOCUMENTS_ROUTES = {
  BASE: `${BASE_API_URL}/api/documents`,
  UPLOAD: `${BASE_API_URL}/api/documents/upload`,
  DOCUMENT: (id: number) => `${BASE_API_URL}/api/documents/${id}`,
} as const;

export const USERS_ROUTES = {
  BASE: `${BASE_API_URL}/api/users`,
  USER: (id: number) => `${BASE_API_URL}/api/users/${id}`,
  LOCK: (id: number) => `${BASE_API_URL}/api/users/lock/${id}`,
  UNLOCK: (id: number) => `${BASE_API_URL}/api/users/unlock/${id}`,
  DELETE_MULTIPLE: (ids: string) => `${BASE_API_URL}/api/users/multiple/${ids}`,
  GENDERS: `${BASE_API_URL}/api/users/genders`,
} as const;

export const ROLES_ROUTES = {
  BASE: `${BASE_API_URL}/api/roles`,
  ROLE: (id: number) => `${BASE_API_URL}/api/roles/${id}`,
  DELETE_MULTIPLE: (ids: string) => `${BASE_API_URL}/api/roles/multiple/${ids}`,
} as const;

export const RBAC_ROUTES = {
  BASE: `${BASE_API_URL}/api/rbac`,
  RBAC: (id: number) => `${BASE_API_URL}/api/rbac/${id}`,
  BY_ROLE: (roleId: number) => `${BASE_API_URL}/api/rbac/role/${roleId}`,
  DELETE_MULTIPLE: (ids: string) => `${BASE_API_URL}/api/rbac/multiple/${ids}`,
  MODULES: `${BASE_API_URL}/api/rbac/modules`,
  ACTIONS: `${BASE_API_URL}/api/rbac/actions`,
} as const;

export const ADMIN_ROUTES = {
  USERS: `${BASE_API_URL}/api/admin/users`,
  USER_STATUS: (id: number) => `${BASE_API_URL}/api/admin/users/${id}/status`,
  TOKEN_ANALYTICS: `${BASE_API_URL}/api/admin/analytics/token-usage`,
  DOCUMENTS: `${BASE_API_URL}/api/admin/documents`,
  DELETE_DOCUMENT: (id: number) =>
    `${BASE_API_URL}/api/admin/documents/${id}/delete`,
} as const;

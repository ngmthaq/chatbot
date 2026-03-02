import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { APP_CONFIG } from '../constants/app-config';
import type { Rbac } from '../types/admin-types';
import type { User } from '../types/auth-types';

// User atom with localStorage persistence
export const userAtom = atomWithStorage<User | null>(
  APP_CONFIG.STORAGE_KEYS.USER,
  null,
);

// Derived authenticated state
export const isAuthenticatedAtom = atom((get) => {
  const user = get(userAtom);
  return user !== null;
});

// Permissions atom
export const permissionsAtom = atom<Rbac[]>([]);

// Auth loading state
export const authLoadingAtom = atom(false);

// Helper atoms for common operations
export const userIdAtom = atom((get) => {
  const user = get(userAtom);
  return user?.id || null;
});

export const userEmailAtom = atom((get) => {
  const user = get(userAtom);
  return user?.email || '';
});

export const userRoleAtom = atom((get) => {
  const user = get(userAtom);
  return user?.role || null;
});

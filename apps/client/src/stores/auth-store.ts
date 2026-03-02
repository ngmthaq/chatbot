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

// Permissions atom with localStorage persistence
export const permissionsAtom = atomWithStorage<Rbac[]>(
  APP_CONFIG.STORAGE_KEYS.PERMISSIONS,
  [],
);

// Auth loading state
export const authLoadingAtom = atom(false);

// Derived atom to check if permissions are loaded
export const permissionsLoadedAtom = atom((get) => {
  const user = get(userAtom);
  const permissions = get(permissionsAtom);
  // If user is authenticated, permissions should be loaded
  return user === null || permissions.length > 0;
});

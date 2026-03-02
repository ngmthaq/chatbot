import { atomWithStorage } from 'jotai/utils';

import { APP_CONFIG } from '../constants/app-config';

export type ThemeMode = 'light' | 'dark';

// Theme atom with localStorage persistence
export const themeAtom = atomWithStorage<ThemeMode>(
  APP_CONFIG.STORAGE_KEYS.THEME,
  'light',
);

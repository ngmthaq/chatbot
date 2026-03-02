import { atom } from 'jotai';

// Selected conversation ID
export const selectedConversationIdAtom = atom<number | null>(null);

// Selected message ID for citation panel
export const selectedMessageForCitationAtom = atom<number | null>(null);

// Dialog open states
export const conversationSettingsOpenAtom = atom<boolean>(false);
export const newConversationDialogOpenAtom = atom<boolean>(false);
export const isCitationPanelOpenAtom = atom<boolean>(false);
export const isVoiceSettingsOpenAtom = atom<boolean>(false);

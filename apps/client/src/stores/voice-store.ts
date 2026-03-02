import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { APP_CONFIG } from '../constants/app-config';
import { VoiceState, type MicPermission } from '../types/voice-types';

// Voice state machine
export const voiceStateAtom = atom<VoiceState>(VoiceState.IDLE);

// Transcript from speech recognition
export const transcriptAtom = atom<string>('');

// Microphone permission status
export const micPermissionAtom = atom<MicPermission>('unknown');

// TTS enabled state with persistence
export const isTTSEnabledAtom = atomWithStorage<boolean>(
  APP_CONFIG.STORAGE_KEYS.TTS_ENABLED,
  true,
);

// Selected voice with persistence (stored as voice name)
export const selectedVoiceNameAtom = atomWithStorage<string | null>(
  APP_CONFIG.STORAGE_KEYS.SELECTED_VOICE,
  null,
);

// STT language with persistence
export const sttLanguageAtom = atomWithStorage<string>(
  APP_CONFIG.STORAGE_KEYS.STT_LANGUAGE,
  APP_CONFIG.VOICE_CONFIG.STT_LANGUAGE,
);

// Derived atoms
export const isListeningAtom = atom((get) => {
  const state = get(voiceStateAtom);
  return state === VoiceState.LISTENING;
});

export const isSpeakingAtom = atom((get) => {
  const state = get(voiceStateAtom);
  return state === VoiceState.SPEAKING;
});

export const isProcessingAtom = atom((get) => {
  const state = get(voiceStateAtom);
  return state === VoiceState.PROCESSING;
});

export const isVoiceIdleAtom = atom((get) => {
  const state = get(voiceStateAtom);
  return state === VoiceState.IDLE;
});

// Voice busy (any state except IDLE)
export const isVoiceBusyAtom = atom((get) => {
  const state = get(voiceStateAtom);
  return state !== VoiceState.IDLE;
});

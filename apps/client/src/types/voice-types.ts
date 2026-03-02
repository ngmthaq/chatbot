export enum VoiceState {
  IDLE = 'IDLE',
  LISTENING = 'LISTENING',
  PROCESSING = 'PROCESSING',
  SPEAKING = 'SPEAKING',
}

export type MicPermission = 'granted' | 'denied' | 'prompt' | 'unknown';

export interface SpeechStatus {
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  error?: string;
}

export interface TTSSettings {
  enabled: boolean;
  voice?: SpeechSynthesisVoice;
  rate: number;
  pitch: number;
  volume: number;
}

export interface STTSettings {
  language: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
}

export interface VoiceConfig {
  tts: TTSSettings;
  stt: STTSettings;
  micPermission: MicPermission;
}

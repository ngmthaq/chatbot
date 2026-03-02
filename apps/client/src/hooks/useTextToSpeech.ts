import { useAtom, useAtomValue } from 'jotai';
import { useState, useEffect, useCallback } from 'react';

import { APP_CONFIG } from '../constants/app-config';
import {
  voiceStateAtom,
  isTTSEnabledAtom,
  selectedVoiceNameAtom,
} from '../stores/voice-store';
import { VoiceState } from '../types/voice-types';

export function useTextToSpeech() {
  const [voiceState, setVoiceState] = useAtom(voiceStateAtom);
  const isTTSEnabled = useAtomValue(isTTSEnabledAtom);
  const [selectedVoiceName] = useAtom(selectedVoiceNameAtom);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const isSupported = 'speechSynthesis' in window;

  const getPreferredVoice = useCallback(
    (availableVoices: SpeechSynthesisVoice[]) => {
      if (availableVoices.length === 0) return null;

      const selectedVoice = selectedVoiceName
        ? availableVoices.find((voice) => voice.name === selectedVoiceName)
        : null;

      if (selectedVoice) return selectedVoice;

      const googleUsEnglishVoice = availableVoices.find(
        (voice) => voice.name === APP_CONFIG.VOICE_CONFIG.DEFAULT_TTS_VOICE,
      );

      return googleUsEnglishVoice || availableVoices[0];
    },
    [selectedVoiceName],
  );

  // Load available voices
  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [isSupported]);

  const speak = useCallback(
    (text: string) => {
      if (!isSupported || !isTTSEnabled || !text) return;

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const newUtterance = new SpeechSynthesisUtterance(text);

      const voice = getPreferredVoice(voices);
      if (voice) {
        newUtterance.voice = voice;
      }

      newUtterance.onstart = () => {
        setVoiceState(VoiceState.SPEAKING);
      };

      newUtterance.onend = () => {
        setVoiceState(VoiceState.IDLE);
      };

      newUtterance.onerror = (event) => {
        // eslint-disable-next-line no-console
        console.error('Speech synthesis error:', event);
        setVoiceState(VoiceState.IDLE);
      };

      window.speechSynthesis.speak(newUtterance);
    },
    [isSupported, isTTSEnabled, voices, setVoiceState, getPreferredVoice],
  );

  const stop = useCallback(() => {
    if (!isSupported) return;

    window.speechSynthesis.cancel();
    setVoiceState(VoiceState.IDLE);
  }, [isSupported, setVoiceState]);

  const isSpeaking = voiceState === VoiceState.SPEAKING;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  return {
    speak,
    stop,
    isSpeaking,
    voices,
    isSupported,
  };
}

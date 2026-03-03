import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useState, useCallback, useRef } from 'react';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';

import {
  voiceStateAtom,
  transcriptAtom,
  micPermissionAtom,
  sttLanguageAtom,
  isVoiceModeAtom,
} from '../stores/voice-store';
import { VoiceState } from '../types/voice-types';

const SILENCE_TIMEOUT_MS = 2000;

export function useSpeechToText() {
  const [voiceState, setVoiceState] = useAtom(voiceStateAtom);
  const [transcript, setTranscript] = useAtom(transcriptAtom);
  const [micPermission, setMicPermission] = useAtom(micPermissionAtom);
  const sttLanguage = useAtomValue(sttLanguageAtom);
  const [isVoiceMode, setIsVoiceMode] = useAtom(isVoiceModeAtom);
  const [error, setError] = useState<string>('');
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevVoiceStateRef = useRef<VoiceState>(VoiceState.IDLE);

  const {
    transcript: recognitionTranscript,
    listening,
    resetTranscript: resetRecognitionTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Check microphone permission
  useEffect(() => {
    if (navigator.mediaDevices && 'getUserMedia' in navigator.mediaDevices) {
      navigator.permissions
        .query({ name: 'microphone' as PermissionName })
        .then((permissionStatus) => {
          setMicPermission(
            permissionStatus.state as 'granted' | 'denied' | 'prompt',
          );
          permissionStatus.onchange = () => {
            setMicPermission(
              permissionStatus.state as 'granted' | 'denied' | 'prompt',
            );
          };
        })
        .catch(() => {
          setMicPermission('unknown');
        });
    }
  }, [setMicPermission]);

  // Update transcript atom when recognition transcript changes
  // In voice mode, start a 2-second silence timer that auto-stops recording
  useEffect(() => {
    if (recognitionTranscript) {
      setTranscript(recognitionTranscript);

      if (isVoiceMode && listening) {
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }
        silenceTimerRef.current = setTimeout(() => {
          // Auto-stop after 2s silence; keep isVoiceMode=true so auto-TTS fires
          SpeechRecognition.stopListening();
        }, SILENCE_TIMEOUT_MS);
      }
    }
  }, [recognitionTranscript, setTranscript, isVoiceMode, listening]);

  // Auto-restart STT after TTS finishes (continuous voice conversation)
  useEffect(() => {
    const justFinishedSpeaking =
      prevVoiceStateRef.current === VoiceState.SPEAKING &&
      voiceState === VoiceState.IDLE;

    prevVoiceStateRef.current = voiceState;

    if (justFinishedSpeaking && isVoiceMode && !listening) {
      resetRecognitionTranscript();
      setTranscript('');
      const timer = setTimeout(() => {
        SpeechRecognition.startListening({
          continuous: true,
          language: sttLanguage,
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [
    voiceState,
    isVoiceMode,
    listening,
    sttLanguage,
    resetRecognitionTranscript,
    setTranscript,
  ]);

  // Update voice state based on listening status
  useEffect(() => {
    if (listening) {
      setVoiceState(VoiceState.LISTENING);
    } else if (voiceState === VoiceState.LISTENING) {
      // When stopped listening, move to PROCESSING if there's transcript
      if (transcript) {
        setVoiceState(VoiceState.PROCESSING);
      } else {
        setVoiceState(VoiceState.IDLE);
      }
    }
  }, [listening, voiceState, transcript, setVoiceState]);

  // Cleanup silence timer on unmount
  useEffect(() => {
    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, []);

  const startListening = useCallback(async () => {
    if (!browserSupportsSpeechRecognition) {
      setError('Speech recognition is not supported in this browser');
      return;
    }

    // Request microphone permission
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermission('granted');
      setError('');
      resetRecognitionTranscript();
      setTranscript('');
      setIsVoiceMode(true);

      SpeechRecognition.startListening({
        continuous: true,
        language: sttLanguage,
      });
    } catch (err) {
      setMicPermission('denied');
      setError('Microphone permission denied');
      // eslint-disable-next-line no-console
      console.error('Microphone permission error:', err);
    }
  }, [
    browserSupportsSpeechRecognition,
    sttLanguage,
    setMicPermission,
    resetRecognitionTranscript,
    setTranscript,
    setIsVoiceMode,
  ]);

  const stopListening = useCallback(() => {
    // Clear the silence timer and exit voice mode (manual abort)
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    setIsVoiceMode(false);
    SpeechRecognition.stopListening();
  }, [setIsVoiceMode]);

  const resetTranscript = useCallback(() => {
    resetRecognitionTranscript();
    setTranscript('');
    setVoiceState(VoiceState.IDLE);
  }, [resetRecognitionTranscript, setTranscript, setVoiceState]);

  return {
    startListening,
    stopListening,
    resetTranscript,
    transcript,
    isListening: listening,
    browserSupportsSpeechRecognition,
    micPermission,
    error,
  };
}

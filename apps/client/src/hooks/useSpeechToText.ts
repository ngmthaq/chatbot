import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useState, useCallback } from 'react';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';

import {
  voiceStateAtom,
  transcriptAtom,
  micPermissionAtom,
  sttLanguageAtom,
} from '../stores/voice-store';
import { VoiceState } from '../types/voice-types';

export function useSpeechToText() {
  const [voiceState, setVoiceState] = useAtom(voiceStateAtom);
  const [transcript, setTranscript] = useAtom(transcriptAtom);
  const [micPermission, setMicPermission] = useAtom(micPermissionAtom);
  const sttLanguage = useAtomValue(sttLanguageAtom);
  const [error, setError] = useState<string>('');

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
  useEffect(() => {
    if (recognitionTranscript) {
      setTranscript(recognitionTranscript);
    }
  }, [recognitionTranscript, setTranscript]);

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

      SpeechRecognition.startListening({
        continuous: false,
        language: sttLanguage,
      });
    } catch (err) {
      setMicPermission('denied');
      setError('Microphone permission denied');
      // eslint-disable-next-line no-console
      console.error('Microphone permission error:', err);
    }
  }, [browserSupportsSpeechRecognition, sttLanguage, setMicPermission]);

  const stopListening = useCallback(() => {
    SpeechRecognition.stopListening();
  }, []);

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

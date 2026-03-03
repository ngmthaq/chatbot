import { Mic, MicOff } from '@mui/icons-material';
import { IconButton, Tooltip, Box } from '@mui/material';
import { useAtomValue, useSetAtom } from 'jotai';
import { useTranslation } from 'react-i18next';

import { useSpeechToText } from '../../hooks/useSpeechToText';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';
import {
  isListeningAtom,
  voiceStateAtom,
  isVoiceModeAtom,
} from '../../stores/voice-store';
import { VoiceState } from '../../types/voice-types';

interface ToggleVoiceButtonProps {
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function ToggleVoiceButton({
  disabled = false,
  size = 'medium',
}: ToggleVoiceButtonProps) {
  const { t } = useTranslation('chat');
  const { startListening, stopListening, browserSupportsSpeechRecognition } =
    useSpeechToText();
  const { stop: stopTTS } = useTextToSpeech();
  const isListening = useAtomValue(isListeningAtom);
  const voiceState = useAtomValue(voiceStateAtom);
  const isVoiceMode = useAtomValue(isVoiceModeAtom);
  const setIsVoiceMode = useSetAtom(isVoiceModeAtom);

  const isActive = isVoiceMode || isListening;

  const handleToggle = () => {
    if (disabled || !browserSupportsSpeechRecognition) return;

    if (isListening) {
      // Manual abort while recording — stopListening already sets isVoiceMode=false
      stopListening();
    } else if (
      voiceState === VoiceState.PROCESSING ||
      voiceState === VoiceState.SPEAKING
    ) {
      // Abort while waiting for API response or TTS is playing
      stopTTS();
      setIsVoiceMode(false);
    } else {
      // Start voice mode
      startListening();
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <Tooltip title={t('voice.notSupported')}>
        <span>
          <IconButton disabled size={size}>
            <MicOff />
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={isActive ? t('voice.stop') : t('voice.start')}>
      <Box
        sx={{
          position: 'relative',
          display: 'inline-flex',
        }}
      >
        <IconButton
          onClick={handleToggle}
          disabled={disabled}
          size={size}
          sx={{
            color: isActive ? 'common.light' : 'inherit',
            bgcolor: isActive ? 'error.light' : 'transparent',
            '&:hover': {
              bgcolor: isActive ? 'error.light' : 'action.hover',
            },
            transition: 'all 0.2s',
          }}
        >
          <Mic />
        </IconButton>
        {isActive && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: '50%',
              border: '2px solid',
              borderColor: 'error.main',
              animation: 'pulse 1.5s ease-out infinite',
              pointerEvents: 'none',
            }}
          />
        )}
      </Box>
    </Tooltip>
  );
}

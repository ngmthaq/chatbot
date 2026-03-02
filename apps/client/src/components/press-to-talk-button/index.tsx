import { Mic, MicOff } from '@mui/icons-material';
import { IconButton, Tooltip, Box } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useTranslation } from 'react-i18next';

import { useSpeechToText } from '../../hooks/useSpeechToText';
import { isListeningAtom, voiceStateAtom } from '../../stores/voice-store';
import type { VoiceState } from '../../types/voice-types';

interface PressToTalkButtonProps {
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function PressToTalkButton({
  disabled = false,
  size = 'medium',
}: PressToTalkButtonProps) {
  const { t } = useTranslation('chat');
  const { startListening, stopListening, browserSupported } = useSpeechToText();
  const isListening = useAtomValue(isListeningAtom);
  const voiceState = useAtomValue(voiceStateAtom);

  const handleMouseDown = () => {
    if (!disabled && browserSupported) {
      startListening();
    }
  };

  const handleMouseUp = () => {
    if (!disabled && browserSupported) {
      stopListening();
    }
  };

  const handleMouseLeave = () => {
    if (isListening) {
      stopListening();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    handleMouseDown();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    handleMouseUp();
  };

  if (!browserSupported) {
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

  const isDisabled = disabled || voiceState === VoiceState.PROCESSING;

  return (
    <Tooltip title={t('voice.pressToTalk')}>
      <Box
        sx={{
          position: 'relative',
          display: 'inline-flex',
        }}
      >
        <IconButton
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          disabled={isDisabled}
          size={size}
          sx={{
            color: isListening ? 'error.main' : 'inherit',
            bgcolor: isListening ? 'error.light' : 'transparent',
            '&:hover': {
              bgcolor: isListening ? 'error.light' : 'action.hover',
            },
            transition: 'all 0.2s',
          }}
        >
          {isListening ? <Mic /> : <MicOff />}
        </IconButton>
        {isListening && (
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

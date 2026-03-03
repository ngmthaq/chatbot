import { Send } from '@mui/icons-material';
import { Box, TextField, IconButton, Tooltip, Paper } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useState, type KeyboardEvent, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import {
  transcriptAtom,
  isListeningAtom,
  voiceStateAtom,
  isVoiceModeAtom,
} from '../../stores/voice-store';
import { VoiceState } from '../../types/voice-types';
import ToggleVoiceButton from '../toggle-voice-button';
import WaveformAnimation from '../waveform-animation';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({
  onSend,
  disabled = false,
}: ChatInputProps) {
  const { t } = useTranslation('chat');
  const [input, setInput] = useState('');
  const transcript = useAtomValue(transcriptAtom);
  const isListening = useAtomValue(isListeningAtom);
  const voiceState = useAtomValue(voiceStateAtom);
  const isVoiceMode = useAtomValue(isVoiceModeAtom);
  const wasListeningRef = useRef(false);

  const isVoiceProcessing = isVoiceMode && voiceState === VoiceState.PROCESSING;
  const isVoiceSpeaking = isVoiceMode && voiceState === VoiceState.SPEAKING;
  const isVoiceActive = isListening || isVoiceProcessing || isVoiceSpeaking;

  const displayValue = isListening ? transcript : input;

  const getPlaceholder = () => {
    if (isListening) return t('input.listening');
    if (isVoiceProcessing) return t('input.processing', 'Processing...');
    if (isVoiceSpeaking) return t('input.speaking', 'Speaking response...');
    return t('input.placeholder');
  };

  const handleSend = () => {
    const message = displayValue.trim();
    if (message && !disabled) {
      onSend(message);
      setInput('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isListening) {
      setInput(e.target.value);
    }
  };

  // Auto-send transcript when recording stops
  useEffect(() => {
    if (wasListeningRef.current && !isListening && transcript.trim()) {
      onSend(transcript);
      setInput('');
    }
    wasListeningRef.current = isListening;
  }, [isListening, transcript, onSend]);

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
        <ToggleVoiceButton disabled={disabled} />

        <Box sx={{ flexGrow: 1 }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={displayValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder={getPlaceholder()}
            disabled={disabled || isVoiceActive}
            size="small"
            slotProps={{
              input: {
                sx: {
                  bgcolor: isListening
                    ? 'error.lighter'
                    : isVoiceProcessing || isVoiceSpeaking
                      ? 'action.hover'
                      : 'background.paper',
                },
              },
            }}
          />
          {isVoiceActive && (
            <Box sx={{ mt: 1 }}>
              <WaveformAnimation />
            </Box>
          )}
        </Box>

        <Tooltip title={t('input.send')}>
          <span>
            <IconButton
              color="primary"
              onClick={handleSend}
              disabled={!displayValue.trim() || disabled || isVoiceActive}
              size="large"
            >
              <Send />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Paper>
  );
}

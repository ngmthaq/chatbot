import { Send } from '@mui/icons-material';
import { Box, TextField, IconButton, Tooltip, Paper } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useState, type KeyboardEvent, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { transcriptAtom, isListeningAtom } from '../../stores/voice-store';
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
  const wasListeningRef = useRef(false);

  const displayValue = isListening ? transcript : input;

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
            placeholder={
              isListening ? t('input.listening') : t('input.placeholder')
            }
            disabled={disabled || isListening}
            size="small"
            slotProps={{
              input: {
                sx: {
                  bgcolor: isListening ? 'error.lighter' : 'background.paper',
                },
              },
            }}
          />
          {isListening && (
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
              disabled={!displayValue.trim() || disabled || isListening}
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

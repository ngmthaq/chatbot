import { Send, Stop } from '@mui/icons-material';
import { Box, TextField, IconButton, Tooltip, Paper } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useState, KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { currentStreamAtom } from '../../stores/streaming-store';
import { transcriptAtom, isListeningAtom } from '../../stores/voice-store';
import PressToTalkButton from '../press-to-talk-button';
import WaveformAnimation from '../waveform-animation';

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop: () => void;
  disabled?: boolean;
}

export default function ChatInput({
  onSend,
  onStop,
  disabled = false,
}: ChatInputProps) {
  const { t } = useTranslation('chat');
  const [input, setInput] = useState('');
  const transcript = useAtomValue(transcriptAtom);
  const isListening = useAtomValue(isListeningAtom);
  const currentStream = useAtomValue(currentStreamAtom);

  const isStreaming = currentStream.status === 'streaming';
  const displayValue = isListening ? transcript : input;

  const handleSend = () => {
    const message = displayValue.trim();
    if (message && !disabled && !isStreaming) {
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
        <PressToTalkButton disabled={disabled || isStreaming} />

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
            disabled={disabled || isStreaming || isListening}
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

        {isStreaming ? (
          <Tooltip title={t('input.stop')}>
            <IconButton color="error" onClick={onStop} size="large">
              <Stop />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title={t('input.send')}>
            <span>
              <IconButton
                color="primary"
                onClick={handleSend}
                disabled={!displayValue.trim() || disabled}
                size="large"
              >
                <Send />
              </IconButton>
            </span>
          </Tooltip>
        )}
      </Box>
    </Paper>
  );
}

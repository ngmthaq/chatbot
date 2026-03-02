import { Box } from '@mui/material';
import { useAtomValue } from 'jotai';

import { isListeningAtom } from '../../stores/voice-store';

interface WaveformAnimationProps {
  height?: number;
  barCount?: number;
}

export default function WaveformAnimation({
  height = 40,
  barCount = 5,
}: WaveformAnimationProps) {
  const isListening = useAtomValue(isListeningAtom);

  if (!isListening) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.5,
        height,
      }}
    >
      {Array.from({ length: barCount }).map((_, index) => (
        <Box
          key={index}
          sx={{
            width: 4,
            bgcolor: 'error.main',
            borderRadius: 1,
            animation: `waveform 1s ease-in-out infinite`,
            animationDelay: `${index * 0.1}s`,
          }}
        />
      ))}
    </Box>
  );
}

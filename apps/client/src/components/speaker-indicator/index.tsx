import { VolumeUp } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useTranslation } from 'react-i18next';

import { isSpeakingAtom } from '../../stores/voice-store';

export default function SpeakerIndicator() {
  const { t } = useTranslation('chat');
  const isSpeaking = useAtomValue(isSpeakingAtom);

  if (!isSpeaking) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 2,
        py: 1,
        bgcolor: 'primary.light',
        borderRadius: 1,
        animation: 'fadeIn 0.3s',
      }}
    >
      <VolumeUp
        sx={{
          color: 'primary.main',
          animation: 'pulse 1s ease-in-out infinite',
        }}
      />
      <Typography variant="body2" color="primary.dark" fontWeight={500}>
        {t('voice.speaking')}
      </Typography>
    </Box>
  );
}

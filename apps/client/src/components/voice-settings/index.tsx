import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormLabel,
  Switch,
  Select,
  MenuItem,
  FormControlLabel,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';

import { useTextToSpeech } from '../../hooks/useTextToSpeech';
import {
  isTTSEnabledAtom,
  selectedVoiceNameAtom,
  sttLanguageAtom,
} from '../../stores/voice-store';

interface VoiceSettingsProps {
  open: boolean;
  onClose: () => void;
}

export default function VoiceSettings({ open, onClose }: VoiceSettingsProps) {
  const { t } = useTranslation('chat');
  const { voices: availableVoices } = useTextToSpeech();

  const [isTTSEnabled, setIsTTSEnabled] = useAtom(isTTSEnabledAtom);
  const [selectedVoiceName, setSelectedVoiceName] = useAtom(
    selectedVoiceNameAtom,
  );
  const [sttLanguage, setSTTLanguage] = useAtom(sttLanguageAtom);

  const handleTestVoice = () => {
    const utterance = new SpeechSynthesisUtterance(
      'This is a test of the text-to-speech system.',
    );
    const voice = availableVoices.find(
      (v: SpeechSynthesisVoice) => v.name === selectedVoiceName,
    );
    if (voice) {
      utterance.voice = voice;
    }
    speechSynthesis.speak(utterance);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('voice.settingsTitle')}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
          {/* Text-to-Speech Settings */}
          <Box>
            <Typography variant="subtitle2" gutterBottom fontWeight={600}>
              {t('voice.ttsSettings')}
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={isTTSEnabled}
                  onChange={(e) => setIsTTSEnabled(e.target.checked)}
                />
              }
              label={t('voice.enableTTS')}
              sx={{ mb: 2 }}
            />

            {isTTSEnabled && (
              <>
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <FormLabel sx={{ mb: 1 }}>{t('voice.selectVoice')}</FormLabel>
                  <Select
                    value={selectedVoiceName}
                    onChange={(e) => setSelectedVoiceName(e.target.value)}
                  >
                    {availableVoices?.map((voice: SpeechSynthesisVoice) => (
                      <MenuItem key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </MenuItem>
                    )) || <MenuItem value="">No voices available</MenuItem>}
                  </Select>
                </FormControl>

                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleTestVoice}
                  fullWidth
                >
                  {t('voice.testVoice')}
                </Button>
              </>
            )}
          </Box>

          <Divider />

          {/* Speech-to-Text Settings */}
          <Box>
            <Typography variant="subtitle2" gutterBottom fontWeight={600}>
              {t('voice.sttSettings')}
            </Typography>

            <FormControl fullWidth size="small">
              <FormLabel sx={{ mb: 1 }}>{t('voice.language')}</FormLabel>
              <Select
                value={sttLanguage}
                onChange={(e) => setSTTLanguage(e.target.value)}
              >
                <MenuItem value="en-US">English (US)</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="contained">
          {t('voice.done')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

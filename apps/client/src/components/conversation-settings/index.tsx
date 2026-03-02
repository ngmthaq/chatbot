import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Slider,
  Typography,
  Box,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useConversationForm } from '../../forms/useConversationForm';
import { ConversationSettings as ConversationSettingsType } from '../../types/chat-types';

interface ConversationSettingsProps {
  open: boolean;
  onClose: () => void;
  onSave: (settings: ConversationSettingsType) => void;
  initialSettings?: ConversationSettingsType;
  isLoading?: boolean;
}

export default function ConversationSettings({
  open,
  onClose,
  initialSettings,
  onSave,
  isLoading = false,
}: ConversationSettingsProps) {
  const { t } = useTranslation(['chat', 'forms']);

  const formik = useConversationForm((values) => {
    onSave(values);
  }, initialSettings);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('chat:settings.title')}</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}
        >
          <TextField
            fullWidth
            id="title"
            name="title"
            label={t('chat:settings.conversationTitle')}
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />

          <TextField
            fullWidth
            id="model"
            name="model"
            label={t('chat:settings.model')}
            value={formik.values.model}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.model && Boolean(formik.errors.model)}
            helperText={formik.touched.model && formik.errors.model}
          />

          <Box>
            <Typography gutterBottom>
              {t('chat:settings.temperature')}: {formik.values.temperature}
            </Typography>
            <Slider
              name="temperature"
              value={formik.values.temperature}
              onChange={(_, value) =>
                formik.setFieldValue('temperature', value)
              }
              min={0}
              max={1}
              step={0.1}
              marks
              valueLabelDisplay="auto"
            />
          </Box>

          <TextField
            fullWidth
            id="maxTokens"
            name="maxTokens"
            label={t('chat:settings.maxTokens')}
            type="number"
            value={formik.values.maxTokens}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.maxTokens && Boolean(formik.errors.maxTokens)}
            helperText={formik.touched.maxTokens && formik.errors.maxTokens}
          />

          <TextField
            fullWidth
            id="contextWindow"
            name="contextWindow"
            label={t('chat:settings.contextWindow')}
            type="number"
            value={formik.values.contextWindow}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.contextWindow &&
              Boolean(formik.errors.contextWindow)
            }
            helperText={
              formik.touched.contextWindow && formik.errors.contextWindow
            }
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isLoading}>
          {t('forms:actions.cancel')}
        </Button>
        <Button
          onClick={() => formik.handleSubmit()}
          variant="contained"
          disabled={isLoading}
        >
          {t('forms:actions.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

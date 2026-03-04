import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useConversationForm } from '../../forms/useConversationForm';
import type { ConversationSettings as ConversationSettingsType } from '../../types/chat-types';

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

  const formik = useConversationForm(
    initialSettings || {
      title: '',
    },
    (values) => {
      onSave(values);
    },
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('chat:settings.title')}</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 1, pt: 1 }}
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

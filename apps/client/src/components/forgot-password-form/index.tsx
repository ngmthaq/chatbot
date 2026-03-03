import { Send, ArrowBack } from '@mui/icons-material';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Paper,
  Alert,
} from '@mui/material';
import { Link as RouterLink } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useForgotPasswordForm } from '../../forms/useForgotPasswordForm';

export default function ForgotPasswordForm() {
  const { t } = useTranslation(['auth', 'forms']);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useForgotPasswordForm({ email: '' }, async (_values) => {
    setIsLoading(true);
    // TODO: Implement forgot password API call
    // For now, simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitted(true);
    setIsLoading(false);
  });

  if (isSubmitted) {
    return (
      <Paper elevation={3} sx={{ p: 4, maxWidth: 500, width: '100%' }}>
        <Typography
          variant="h5"
          fontWeight={600}
          gutterBottom
          textAlign="center"
        >
          {t('auth:forgotPassword.checkEmail')}
        </Typography>
        <Alert severity="success" sx={{ my: 2 }}>
          {t('auth:forgotPassword.emailSent')}
        </Alert>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {t('auth:forgotPassword.checkInbox')}
        </Typography>
        <Button
          component={RouterLink}
          to="/login"
          fullWidth
          variant="outlined"
          startIcon={<ArrowBack />}
        >
          {t('auth:forgotPassword.backToLogin')}
        </Button>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, width: '100%' }}>
      <Typography variant="h5" fontWeight={600} gutterBottom textAlign="center">
        {t('auth:forgotPassword.title')}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        textAlign="center"
        sx={{ mb: 3 }}
      >
        {t('auth:forgotPassword.subtitle')}
      </Typography>

      <Box component="form" onSubmit={formik.handleSubmit} noValidate>
        <TextField
          fullWidth
          id="email"
          name="email"
          label={t('auth:forgotPassword.email')}
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          autoComplete="email"
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={isLoading}
          startIcon={<Send />}
          sx={{ mt: 3, mb: 2 }}
        >
          {isLoading
            ? t('auth:forgotPassword.sending')
            : t('auth:forgotPassword.sendButton')}
        </Button>

        <Typography variant="body2" textAlign="center" color="text.secondary">
          <Link
            component={RouterLink}
            to="/login"
            underline="hover"
            sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
          >
            <ArrowBack fontSize="small" />
            {t('auth:forgotPassword.backToLogin')}
          </Link>
        </Typography>
      </Box>
    </Paper>
  );
}

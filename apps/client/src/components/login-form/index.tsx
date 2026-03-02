import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
} from '@mui/icons-material';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Paper,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Link as RouterLink } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useLoginForm } from '../../forms/useLoginForm';
import { useLogin } from '../../mutations/useLogin';

export default function LoginForm() {
  const { t } = useTranslation(['auth', 'forms']);
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending } = useLogin();

  const formik = useLoginForm({ email: '', password: '' }, (values) => {
    login(values);
  });

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, width: '100%' }}>
      <Typography variant="h5" fontWeight={600} gutterBottom textAlign="center">
        {t('auth:login.title')}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        textAlign="center"
        sx={{ mb: 3 }}
      >
        {t('auth:login.subtitle')}
      </Typography>

      <Box component="form" onSubmit={formik.handleSubmit} noValidate>
        <TextField
          fullWidth
          id="email"
          name="email"
          label={t('auth:login.email')}
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          autoComplete="email"
          autoFocus
        />

        <TextField
          fullWidth
          id="password"
          name="password"
          label={t('auth:login.password')}
          type={showPassword ? 'text' : 'password'}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          autoComplete="current-password"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <Box sx={{ textAlign: 'right', mb: 2 }}>
          <Link
            component={RouterLink}
            to="/forgot-password"
            variant="body2"
            underline="hover"
          >
            {t('auth:login.forgotPassword')}
          </Link>
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={isPending}
          startIcon={<LoginIcon />}
          sx={{ mb: 2 }}
        >
          {isPending ? t('auth:login.loggingIn') : t('auth:login.loginButton')}
        </Button>

        <Typography variant="body2" textAlign="center" color="text.secondary">
          {t('auth:login.noAccount')}{' '}
          <Link component={RouterLink} to="/register" underline="hover">
            {t('auth:login.signUpLink')}
          </Link>
        </Typography>
      </Box>
    </Paper>
  );
}

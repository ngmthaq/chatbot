import { Visibility, VisibilityOff, PersonAdd } from '@mui/icons-material';
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
import { Link as RouterLink, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useRegisterForm } from '../../forms/useRegisterForm';
import { useRegister } from '../../mutations/useRegister';

export default function RegisterForm() {
  const { t } = useTranslation(['auth', 'forms']);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate: register, isPending } = useRegister();

  const formik = useRegisterForm(
    { email: '', name: '', password: '', confirmPassword: '' },
    (values) => {
      register(values, {
        onSuccess: () => {
          setTimeout(() => {
            navigate({ to: '/login' });
          }, 2000);
        },
      });
    },
  );

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
      <Typography variant="h5" fontWeight={600} gutterBottom textAlign="center">
        {t('auth:register.title')}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        textAlign="center"
        sx={{ mb: 3 }}
      >
        {t('auth:register.subtitle')}
      </Typography>

      <Box component="form" onSubmit={formik.handleSubmit} noValidate>
        <TextField
          fullWidth
          id="name"
          name="name"
          label={t('auth:register.name')}
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          margin="normal"
          autoComplete="name"
          autoFocus
        />

        <TextField
          fullWidth
          id="email"
          name="email"
          label={t('auth:register.email')}
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          margin="normal"
          autoComplete="email"
        />

        <TextField
          fullWidth
          id="password"
          name="password"
          label={t('auth:register.password')}
          type={showPassword ? 'text' : 'password'}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          margin="normal"
          autoComplete="new-password"
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

        <TextField
          fullWidth
          id="confirmPassword"
          name="confirmPassword"
          label={t('auth:register.confirmPassword')}
          type={showConfirmPassword ? 'text' : 'password'}
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.confirmPassword &&
            Boolean(formik.errors.confirmPassword)
          }
          helperText={
            formik.touched.confirmPassword && formik.errors.confirmPassword
          }
          margin="normal"
          autoComplete="new-password"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={isPending}
          startIcon={<PersonAdd />}
          sx={{ mt: 3, mb: 2 }}
        >
          {isPending
            ? t('auth:register.registering')
            : t('auth:register.registerButton')}
        </Button>

        <Typography variant="body2" textAlign="center" color="text.secondary">
          {t('auth:register.haveAccount')}{' '}
          <Link component={RouterLink} to="/login" underline="hover">
            {t('auth:register.loginLink')}
          </Link>
        </Typography>
      </Box>
    </Paper>
  );
}

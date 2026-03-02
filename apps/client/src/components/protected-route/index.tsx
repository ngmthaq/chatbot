import { Block } from '@mui/icons-material';
import { Box, Typography, Container, Paper } from '@mui/material';
import { Navigate } from '@tanstack/react-router';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { useAuth } from '../../hooks/useAuth';
import type { Permission } from '../../types/admin-types';
import LoadingSpinner from '../loading-spinner';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermissions?: Permission[];
  requireAll?: boolean;
}

export default function ProtectedRoute({
  children,
  requiredPermissions = [],
  requireAll = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, checkPermission, isLoading } = useAuth();
  const { t } = useTranslation();

  if (isLoading) {
    return <LoadingSpinner fullScreen message={t('admin:loading.checkingAuth')} />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Check permissions if required
  if (requiredPermissions.length > 0) {
    const hasPermission = requireAll
      ? requiredPermissions.every((perm) => checkPermission(perm))
      : requiredPermissions.some((perm) => checkPermission(perm));

    if (!hasPermission) {
      return (
        <Container maxWidth="sm">
          <Box
            sx={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 4,
                textAlign: 'center',
                borderRadius: 2,
              }}
            >
              <Block sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom fontWeight={600}>
                {t('admin:noPermission.title')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('admin:noPermission.message')}
              </Typography>
            </Paper>
          </Box>
        </Container>
      );
    }
  }

  return <>{children}</>;
}

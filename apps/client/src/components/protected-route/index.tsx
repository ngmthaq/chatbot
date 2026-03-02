import { Block } from '@mui/icons-material';
import { Box, Typography, Container, Paper } from '@mui/material';
import { Navigate } from '@tanstack/react-router';
import { ReactNode } from 'react';

import { useAuth } from '../../hooks/useAuth';
import { Permission } from '../../types/admin-types';
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

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Checking authentication..." />;
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
                Access Denied
              </Typography>
              <Typography variant="body1" color="text.secondary">
                You don't have permission to access this page.
              </Typography>
            </Paper>
          </Box>
        </Container>
      );
    }
  }

  return <>{children}</>;
}

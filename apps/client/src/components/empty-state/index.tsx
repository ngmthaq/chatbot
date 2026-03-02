import { Box, Typography, Button } from '@mui/material';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 3,
        textAlign: 'center',
      }}
    >
      {icon && (
        <Box sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }}>{icon}</Box>
      )}
      <Typography variant="h6" gutterBottom fontWeight={600}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {description}
        </Typography>
      )}
      {action && (
        <Button
          variant="contained"
          startIcon={action.icon}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </Box>
  );
}

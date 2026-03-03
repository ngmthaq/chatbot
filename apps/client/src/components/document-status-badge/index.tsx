import { CheckCircle, Error, HourglassEmpty, Sync } from '@mui/icons-material';
import { Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { DocumentStatus } from '../../types/document-types';

interface DocumentStatusBadgeProps {
  status: DocumentStatus;
}

export default function DocumentStatusBadge({
  status,
}: DocumentStatusBadgeProps) {
  const { t } = useTranslation('documents');

  const getStatusConfig = () => {
    switch (status) {
      case DocumentStatus.PENDING:
        return {
          label: t('status.pending'),
          color: 'default' as const,
          icon: <HourglassEmpty />,
        };
      case DocumentStatus.PROCESSING:
        return {
          label: t('status.processing'),
          color: 'info' as const,
          icon: <Sync />,
        };
      case DocumentStatus.COMPLETED:
        return {
          label: t('status.completed'),
          color: 'success' as const,
          icon: <CheckCircle />,
        };
      case DocumentStatus.FAILED:
        return {
          label: t('status.failed'),
          color: 'error' as const,
          icon: <Error />,
        };
      default:
        return {
          label: status,
          color: 'default' as const,
          icon: null,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Chip
      label={config.label}
      color={config.color}
      size="small"
      icon={config.icon || undefined}
    />
  );
}
